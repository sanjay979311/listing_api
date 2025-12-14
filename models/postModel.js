// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     shortDescription: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     state: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "State",
//       default: null,
//     },

//     city: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "City",
//       default: null,
//     },

//     area: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Area",
//       default: null,
//     },

//     tags: {
//       type: [String],
//       default: [],
//     },

//     image: {
//       type: String,
//       default: null,
//     },

//    status: {
//   type: String,
//   enum: ["draft", "pending", "published", "rejected", "archived"],
//   default: "draft",
// },

//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },

//     metaTitle: {
//       type: String,
//       trim: true,
//     },

//     metaDescription: {
//       type: String,
//       trim: true,
//     }
//   },
//   { timestamps: true }
// );

// // Auto-generate slug if not provided
// PostSchema.pre("validate", function (next) {
//   if (!this.slug && this.title) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)+/g, "");
//   }
//   next();
// });

// const PostModel = mongoose.model("Post", PostSchema);
// export default PostModel;


import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      default: null,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: null,
    },

   status: {
  type: String,
  enum: ["draft", "pending", "published", "rejected", "archived"],
  default: "draft",
},

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

// Auto-generate slug if not provided
PostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
