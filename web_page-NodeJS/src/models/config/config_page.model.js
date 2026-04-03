const { Schema, model } = require('mongoose');

const configPageSchema = new Schema({
    hero_title: { type: String },
    hero_subtitle: { type: String },
    hero_image_url: { type: String },
    service_1: { type: String },
    service_2: { type: String },
    service_3: { type: String },
    service_4: { type: String },
    service_1_desc: { type: String },
    service_2_desc: { type: String },
    service_3_desc: { type: String },
    service_4_desc: { type: String },
    service_text: { type: String },
    about_us_title: { type: String },
    about_us_text: { type: String },
    about_us_text_2: { type: String },
    about_us_video_url: { type: String },
});

module.exports = model('Config_page', configPageSchema);