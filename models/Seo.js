const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema(
{
    pageType:{
        type:String,
        enum:[
            "home",
            "category",
            "shayari",
            "page",
            "language"
        ],
        required:true,
        index:true
    },

    referenceId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        index:true
    },

    language:{
        type:String,
        default:"hi",
        index:true
    },

    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:70
    },

    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:170
    },

    keywords:{
        type:[String],
        default:[]
    },

    canonicalUrl:{
        type:String,
        default:""
    },

    slug:{
        type:String,
        default:"",
        index:true
    },

    robots:{
        index:Boolean,
        follow:Boolean,
        archive:Boolean
    },

    openGraph:{
        title:String,
        description:String,
        image:String,
        type:{
            type:String,
            default:"website"
        }
    },

    twitter:{
        title:String,
        description:String,
        image:String,
        card:{
            type:String,
            default:"summary_large_image"
        }
    },

    schemaType:{
        type:String,
        default:"WebPage"
    },

    priority:{
        type:Number,
        default:0.8
    },

    changeFrequency:{
        type:String,
        enum:[
            "always",
            "hourly",
            "daily",
            "weekly",
            "monthly",
            "yearly"
        ],
        default:"weekly"
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true,
    versionKey:false
});

seoSchema.index({
    pageType:1,
    language:1
});

seoSchema.index({
    slug:1
});

module.exports = mongoose.model("Seo",seoSchema);
