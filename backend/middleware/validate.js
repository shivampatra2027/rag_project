const Joi = require('joi');

const doubtSchema = Joi.object({
  question: Joi.string().min(3).required(),
});

const revisionSchema = Joi.object({
  examDate: Joi.date().required(),
  hoursPerDay: Joi.number().min(1).max(12).required(),
});

const predictSchema = Joi.object({
  examName: Joi.string().required(),
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    console.log('[VALIDATION] request validated');
    next();
  };
}

module.exports = {
  validate,
  doubtSchema,
  revisionSchema,
  predictSchema,
};
