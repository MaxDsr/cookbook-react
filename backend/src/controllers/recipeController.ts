import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {Recipe} from "../models";
import {IRecipe} from "../contracts/recipe";
import {Types} from "mongoose";
import {minio} from "../dataSources";
import {createCryptoString} from "../utils/cryptoString";
import { v4 as uuidv4 } from "uuid";


// make a seeder script to seed the recipes with the new image structure
// keep in mind the etags and filenames
export const recipeController = {
  create: async(
    req: Request,
    res: Response
  ) => {

    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const recipeData: Pick<IRecipe, 'name' | 'ingredients' | 'time' | 'servings' | 'steps' | 'userId'> = {
      name: req.body.name,
      ingredients: typeof req.body.ingredients === 'string' 
        ? JSON.parse(req.body.ingredients) 
        : req.body.ingredients,
      time: req.body.time,
      servings: req.body.servings,
      steps: req.body.steps,
      userId: req.userId
    };

    const image = req.file;
    let imageBucketData = null;

    if (image) {
      // Generate unique filename
      const fileExtension = image.originalname.split('.').pop();
      const uniqueFilename = `recipe-${uuidv4()}.${fileExtension}`;

      // Upload file to MinIO
      imageBucketData = await minio.client.putObject(
        minio.bucketName,
        uniqueFilename,
        image.buffer,
        image.size,
        {
          'Content-Type': image.mimetype,
        }
      );

      imageBucketData = { etag: imageBucketData.etag, filename: uniqueFilename };

      const presignedUrl = await minio.client.presignedGetObject(
        minio.bucketName,
        uniqueFilename,
        5 * 60 // 5 minutes expiration
      );

      imageBucketData = { etag: imageBucketData.etag, filename: uniqueFilename, url: presignedUrl };
    }
    const recipe = new Recipe({
      ...recipeData,
      ...(imageBucketData
        ? { image: { etag: imageBucketData.etag, filename: imageBucketData.filename } }
        : { image: { filename: "recipe-default.jpg", etag: "409f33f747a2671563173c30a042f778" }})
    });


    try {
      await recipe.save();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error?.message || error,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return res.status(StatusCodes.OK).json({
      message: "Ok",
      status: StatusCodes.OK
    });
  },
  getAll: async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
          status: StatusCodes.NOT_FOUND
        });
      }

      const userId = new Types.ObjectId(req.userId);
      const allRecipes = await Recipe.find({userId});

      const allRecipesWithImageUrl = await Promise.all(allRecipes.map(async (recipe) => {
        const {userId, image, ...recipeObject} = recipe.toObject();
        
        return {
          ...recipeObject,
          imageUrl: await minio.client.presignedGetObject(
            minio.bucketName,
            recipe.image.filename,
            5 * 60
          )
        }
      }));

      return res.status(StatusCodes.OK).json({
        data: allRecipesWithImageUrl,
        status: StatusCodes.OK
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  },
  edit: async (
    req: Request,
    res: Response,
  ) => {
    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const recipeId: IRecipe['_id'] = req.params.id;
    const recipeDoc = await Recipe.findById(recipeId);

    if (!recipeDoc) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Recipe doesn't exists",
          status: StatusCodes.NOT_FOUND
        });
    }

    if (recipeDoc.userId?.toString() !== req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Can't update recipe",
        status: StatusCodes.FORBIDDEN,
      });
    }

    // Update basic fields
    recipeDoc.name = req.body.name;
    recipeDoc.ingredients = typeof req.body.ingredients === 'string' 
      ? JSON.parse(req.body.ingredients) 
      : req.body.ingredients;
    recipeDoc.time = req.body.time;
    recipeDoc.servings = req.body.servings;
    recipeDoc.steps = req.body.steps;

    // Handle image upload if a new file is provided
    const image = req.file;
    if (image) {
      // Generate unique filename
      const fileExtension = image.originalname.split('.').pop();
      const uniqueFilename = `recipe-${uuidv4()}.${fileExtension}`;

      // Upload file to MinIO
      const imageBucketData = await minio.client.putObject(
        minio.bucketName,
        uniqueFilename,
        image.buffer,
        image.size,
        {
          'Content-Type': image.mimetype,
        }
      );

      // Update recipe with new image
      recipeDoc.image = { 
        etag: imageBucketData.etag, 
        filename: uniqueFilename 
      };
    }

    try {
      await recipeDoc.save();
      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Couldn't update the recipe",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  },
  delete: async (
    req: Request,
    res: Response
  ) => {
    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const recipeId: IRecipe['_id'] = req.params.id;
    const recipeDoc = await Recipe.findById(recipeId);

    if (!recipeDoc) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Recipe doesn't exists",
        status: StatusCodes.NOT_FOUND
      });
    }

    if (recipeDoc.userId?.toString() !== req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Can't delete recipe",
        status: StatusCodes.FORBIDDEN,
      });
    }

    try {
      await recipeDoc.deleteOne();
      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    } catch {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Couldn't delete the recipe",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "not found",
      status: StatusCodes.NOT_FOUND
    });
  },

  
  uploadImage: async (
    req: Request,
    res: Response
  ) => {
    try {
      // Check if user is authenticated
      if (!req.userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "User not authenticated",
          status: StatusCodes.UNAUTHORIZED
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "No image file provided",
          status: StatusCodes.BAD_REQUEST
        });
      }

      const file = req.file;
      
      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFilename = `recipe-${Date.now()}-${createCryptoString({ length: 8 })}.${fileExtension}`;

      // Upload file to MinIO
      await minio.client.putObject(
        minio.bucketName,
        uniqueFilename,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        }
      );

      // Generate presigned URL for accessing the file
      const presignedUrl = await minio.client.presignedGetObject(
        minio.bucketName,
        uniqueFilename,
        24 * 60 * 60 // 24 hours expiration
      );

      return res.status(StatusCodes.OK).json({
        message: "Image uploaded successfully",
        status: StatusCodes.OK,
        data: {
          filename: uniqueFilename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: presignedUrl
        }
      });

    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to upload image",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  }
}
