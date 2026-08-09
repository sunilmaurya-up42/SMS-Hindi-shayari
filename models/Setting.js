const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "SMS Hindi Shayari",
      trim: true
    },

    siteTagline: {
      type: String,
      default: ""
    },

    siteDescription: {
      type: String,
      default: ""
    },

    siteKeywords: {
      type: [String],
      default: []
    },

    siteUrl: {
      type: String,
      default: ""
    },

    logo: {
      type: String,
      default: ""
    },

    favicon: {
      type: String,
      default: ""
    },

    adminEmail: {
      type: String,
      default: ""
    },

    contactEmail: {
      type: String,
      default: ""
    },

    contactPhone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    github: {
      username: {
        type: String,
        default: ""
      },

      repository: {
        type: String,
        default: ""
      },

      branch: {
        type: String,
        default: "main"
      },

      backgroundFolder: {
        type: String,
        default: "backgrounds"
      }
    },

    adsense: {
      enabled: {
        type: Boolean,
        default: false
      },

      clientId: {
        type: String,
        default: ""
      }
    },

    analytics: {
      googleAnalyticsId: {
        type: String,
        default: ""
      }
    },

    aiImage: {
      enabled: {
        type: Boolean,
        default: true
      },

      defaultFont: {
        type: String,
        default: "Noto Sans Devanagari"
      },

      textColor: {
        type: String,
        default: "#FFFFFF"
      },

      strokeColor: {
        type: String,
        default: "#000000"
      },

      shadow: {
        type: Boolean,
        default: true
      }
    },

    seo: {
      defaultTitle: {
        type: String,
        default: ""
      },

      defaultDescription: {
        type: String,
        default: ""
      },

      defaultKeywords: {
        type: [String],
        default: []
      }
    },

    maintenanceMode: {
      type: Boolean,
      default: false
    },

    commentsEnabled: {
      type: Boolean,
      default: true
    },

    registrationEnabled: {
      type: Boolean,
      default: false
    },

    downloadEnabled: {
      type: Boolean,
      default: true
    },

    watermarkEnabled: {
      type: Boolean,
      default: false
    },

    watermarkText: {
      type: String,
      default: "SMS Hindi Shayari"
    },

    activeTheme: {
      type: String,
      default: "modern"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Setting", settingSchema);
