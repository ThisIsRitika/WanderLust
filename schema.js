const Joi=require('joi');

module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string().allow("",null).default("https://th.bing.com/th?id=OIP.ERMS2ht42VhZAoexByHCXwHaEv&w=312&h=200&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2")
        }),
        category: Joi.array().required(),
    }).required()
});

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});