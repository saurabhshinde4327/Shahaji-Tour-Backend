const SliderImage = require('../models/SliderImage');
const { sendSuccess, sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

class SliderController {
  static async getAll(req, res) {
    try {
      const { active_only } = req.query;
      const images = active_only === 'true' 
        ? await SliderImage.findActive()
        : await SliderImage.findAll();
      return sendSuccess(res, { images, count: images.length });
    } catch (error) {
      logger.error('Error getting slider images:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const image = await SliderImage.findById(id);
      if (!image) {
        return sendError(res, 'Slider image not found', HTTP_STATUS.NOT_FOUND);
      }
      return sendSuccess(res, { image });
    } catch (error) {
      logger.error('Error getting slider image:', error);
      return sendError(res, 'Database error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async create(req, res) {
    try {
      const { image_url, title, description, display_order, is_active } = req.body;
      
      if (!image_url) {
        return sendError(res, 'image_url is required', HTTP_STATUS.BAD_REQUEST);
      }

      const imageId = await SliderImage.create({
        image_url,
        title,
        description,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : 1
      });

      const image = await SliderImage.findById(imageId);
      return sendSuccess(res, { image }, HTTP_STATUS.CREATED);
    } catch (error) {
      logger.error('Error creating slider image:', error);
      return sendError(res, 'Server error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { image_url, title, description, display_order, is_active } = req.body;

      const updated = await SliderImage.update(id, {
        image_url,
        title,
        description,
        display_order,
        is_active
      });

      if (!updated) {
        return sendError(res, 'Slider image not found', HTTP_STATUS.NOT_FOUND);
      }

      const image = await SliderImage.findById(id);
      return sendSuccess(res, { image });
    } catch (error) {
      logger.error('Error updating slider image:', error);
      return sendError(res, 'Server error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await SliderImage.delete(id);
      
      if (!deleted) {
        return sendError(res, 'Slider image not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, { message: 'Slider image deleted successfully' });
    } catch (error) {
      logger.error('Error deleting slider image:', error);
      return sendError(res, 'Server error: ' + error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = SliderController;

