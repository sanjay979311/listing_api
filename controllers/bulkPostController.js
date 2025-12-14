import BulkPost from "../models/postModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import State from '../models/stateModel.js';
import City from '../models/cityModel.js';
import Area from '../models/areaModel.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





export const createBulkPost = async (req, res) => {
  try {
    const { title, description,category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }


    const hasState = /{state}/.test(title) || /{state}/.test(description);
    const hasCity = /{city}/.test(title) || /{city}/.test(description);
    const hasArea = /{area}/.test(title) || /{area}/.test(description);

    // Helper function to replace placeholders dynamically
    const applyTemplate = (text, data) => {
      return text
        .replace(/{state}/g, data.state || "")
        .replace(/{city}/g, data.city || "")
        .replace(/{area}/g, data.area || "");
    };

    let generatedPosts = [];

    // --------------------------------------------------
    // 1️⃣ STATE BASED POSTS
    // --------------------------------------------------
    if (hasState && !hasCity && !hasArea) {
      const states = await State.find({});
      if (!states.length)
        return res.status(400).json({ success: false, message: "No states found" });

      const posts = states.map(st => {
        const newTitle = applyTemplate(title, { state: st.name });
        const newDesc = applyTemplate(description, { state: st.name });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: st._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all states",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 2️⃣ CITY BASED POSTS
    // --------------------------------------------------
    if (hasCity && !hasArea) {
      const cities = await City.find({}).populate("state", "name");
      if (!cities.length)
        return res.status(400).json({ success: false, message: "No cities found" });

      const posts = cities.map(ct => {
        const newTitle = applyTemplate(title, {
          state: ct.state?.name,
          city: ct.name,
        });

        const newDesc = applyTemplate(description, {
          state: ct.state?.name,
          city: ct.name,
        });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: ct.state?._id,
          city: ct._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all cities",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // 3️⃣ AREA BASED POSTS
    // --------------------------------------------------
    if (hasArea) {
      const areas = await Area.find({})
        .populate("state city", "name");

      if (!areas.length)
        return res.status(400).json({ success: false, message: "No areas found" });

      const posts = areas.map(ar => {
        const newTitle = applyTemplate(title, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        const newDesc = applyTemplate(description, {
          state: ar.state?.name,
          city: ar.city?.name,
          area: ar.name,
        });

        return BulkPost.create({
          title: newTitle,
          description: newDesc,
          category,
          state: ar.state?._id,
          city: ar.city?._id,
          area: ar._id,
        });
      });

      generatedPosts = await Promise.all(posts);

      return res.status(201).json({
        success: true,
        message: "Bulk posts generated for all areas",
        generatedPosts,
      });
    }

    // --------------------------------------------------
    // If no placeholder is found
    // --------------------------------------------------
    return res.status(400).json({
      success: false,
      message: "No valid placeholder ({state}, {city}, {area}) found in title or description",
    });

  } catch (error) {
    console.error("Error in createBulkPost:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



// export const createBulkPost = async (req, res) => {
//     try {
//         const { title, description } = req.body;

//         console.log("Original data:", req.body);

//         const hasState = /{state}/.test(title) || /{state}/.test(description);
//         const hasCity = /{city}/.test(title) || /{city}/.test(description);
//         const hasArea = /{area}/.test(title) || /{area}/.test(description);

//         console.log("hasState ============", hasState)
//         console.log("hasCity ============", hasCity)
//         console.log("hasArea ============", hasArea)


//         if (hasState) {
//             // Fetch all states
//             const states = await State.find({});
//             if (!states || states.length === 0) {
//                 return res.status(400).json({ success: false, message: "No states found in database" });
//             }

//             // const generatedPosts = [];

//             for (const st of states) {
//                 const stateName = st.name;

//                 // Replace all occurrences of {state} with actual state name
//                 const processedTitle = title.replace(/{state}/g, stateName);
//                 const processedDescription = description.replace(/{state}/g, stateName);

//                 // Log or save to database
//                 console.log("Generated Post:", {
//                     title: processedTitle,
//                     description: processedDescription,
//                     state: st._id,
//                 });

//                 //   Save to database if needed
//                   const post = await BulkPost.create({
//                     title: processedTitle,
//                     description: processedDescription,
//                     state: st._id,
//                   });

//                 //   generatedPosts.push(post);
//             }
//         }

//        // for city
//         if(hasCity){
//             const cities = await City.find({}).populate('state', 'name').exec();
//             // console.log("city is ======>",cities)
//             if (!cities || cities.length === 0) {
//                 return res.status(400).json({ success: false, message: "No cities found in database" });
//             }

//              for (const ct of cities) {
//                 const cityName = ct.name;

//                 // Replace all occurrences of {state} with actual state name
//                 const processedTitle = title.replace(/{city}/g, cityName);
//                 const processedDescription = description.replace(/{city}/g, cityName);

//                 // Log or save to database
//                 console.log("Generated Post:", {
//                     title: processedTitle,
//                     description: processedDescription,
//                     state: ct.state._id,
//                     city: ct._id,
//                 });

//                 //   Save to database if needed
//                   const post = await BulkPost.create({
//                     title: processedTitle,
//                     description: processedDescription,
//                    state: ct.state._id,
//                     city: ct._id,
//                   });

//                 //   generatedPosts.push(post);
//             }

//         }

//         // for area

//          if(hasArea){
//             const areas = await Area.find({}).populate('state city', 'name').exec();
//             console.log("areas is ======>",areas)
//             if (!areas || areas.length === 0) {
//                 return res.status(400).json({ success: false, message: "No areas found in database" });
//             }

//              for (const ar of areas) {
//                 const areaName = ar.name;

//                 // Replace all occurrences of {areas} with actual state name
//                 const processedTitle = title.replace(/{area}/g, areaName);
//                 const processedDescription = description.replace(/{area}/g, areaName);

//                 // Log or save to database
//                 console.log("Generated Post:", {
//                     title: processedTitle,
//                     description: processedDescription,
//                     state: ar.state._id,
//                     city: ar.city._id,
//                     area: ar._id,
//                 });

//                 //   Save to database if needed
//                   const post = await BulkPost.create({
//                     title: processedTitle,
//                     description: processedDescription,
//                    state: ar.state._id,
//                     city: ar._id,
//                   });

//                 //   generatedPosts.push(post);
//             }

//         }
//         // close


//         res.status(201).json({
//             success: true,
//             message: "Bulk posts generated for all states successfully",
//             // generatedPosts,
//         });
//     } catch (error) {
//         console.error("Error in createBulkPost:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message,
//         });
//     }
// };



/* ============================================================
   ⭐ LIST ALL BULK POSTS
============================================================ */
export const bulkPostList = async (req, res) => {
    try {
        const list = await BulkPost.find({})
            .populate("category state city area", "name")
           
            .sort({ createdAt: -1 });

        return res.status(200).json(list);

    } catch (err) {
        console.error("Error loading bulk posts:", err);
        res.status(500).json({ message: "Server error" });
    }
};



/* ============================================================
   ⭐ GET BULK POST BY ID
============================================================ */
export const getBulkPostById = async (req, res) => {
    try {
        const post = await BulkPost.findById(req.params.id)
            .populate("category state city area");

        if (!post)
            return res.status(404).json({ message: "Bulk post not found" });

        return res.status(200).json(post);

    } catch (err) {
        console.error("Error fetching bulk post:", err);
        res.status(500).json({ message: "Server error" });
    }
};



/* ============================================================
   ⭐ CLEAN BULK SELECTION LOGIC
============================================================ */





// export const createBulkPost = async (req, res) => {
//     try {
//         const {
//             title,
//             shortDescription,
//             description,
//             content,
//             category,
//             state,
//             city,
//             area,
//             metaTitle,
//             metaDescription,
//             author
//         } = req.body;

//         if (!title || !description || !shortDescription || !category || !author) {
//             return res.status(400).json({
//                 error: "title, description, shortDescription, category, and author are required"
//             });
//         }

//         const images = req.files?.map(file => file.filename) || [];

//         // Utility to dynamically build fields based on location
//         const buildField = (baseValue, stateName, cityName, areaName) => {
//             if (!stateName && !cityName && !areaName) return baseValue;          // state empty
//             if (stateName && !cityName && !areaName) return `${baseValue} ${stateName}`.trim();  // city empty
//             if (stateName && cityName && !areaName) return `${baseValue} ${cityName}`.trim();    // area empty
//             if (stateName && cityName && areaName) return `${baseValue} ${areaName}`.trim();    // all filled
//             return baseValue;
//         };

//         let locations = [];

//         // CASE 1: state empty + city empty + area empty → all states
//         if (!state && !city && !area) {
//             const allStates = await State.find({});
//             locations = allStates.map(st => ({
//                 state: st._id,
//                 city: null,
//                 area: null,
//                 title: buildField(title, st.name, null, null),
//                 metaTitle: buildField(metaTitle || title, st.name, null, null),
//                 metaDescription: buildField(metaDescription || shortDescription, st.name, null, null),
//                 shortDescription: buildField(shortDescription, st.name, null, null),
//                 description: buildField(description, st.name, null, null),
//             }));
//         }

//         // CASE 2: state selected + city empty + area empty → all cities of state
//         else if (state && !city && !area) {
//             const stateDoc = await State.findById(state);
//             const allCities = await City.find({ state });
//             locations = allCities.map(ct => ({
//                 state,
//                 city: ct._id,
//                 area: null,
//                 title: buildField(title, stateDoc?.name, ct.name, null),
//                 metaTitle: buildField(metaTitle || title, stateDoc?.name, ct.name, null),
//                 metaDescription: buildField(metaDescription || shortDescription, stateDoc?.name, ct.name, null),
//                 shortDescription: buildField(shortDescription, stateDoc?.name, ct.name, null),
//                 description: buildField(description, stateDoc?.name, ct.name, null),
//             }));
//         }

//         // CASE 3: state + city selected + area empty → all areas of city
//         else if (state && city && !area) {
//             const stateDoc = await State.findById(state);
//             const cityDoc = await City.findById(city);
//             const allAreas = await Area.find({ city });
//             locations = allAreas.map(ar => ({
//                 state,
//                 city,
//                 area: ar._id,
//                 title: buildField(title, stateDoc?.name, cityDoc?.name, ar.name),
//                 metaTitle: buildField(metaTitle || title, stateDoc?.name, cityDoc?.name, ar.name),
//                 metaDescription: buildField(metaDescription || shortDescription, stateDoc?.name, cityDoc?.name, ar.name),
//                 shortDescription: buildField(shortDescription, stateDoc?.name, cityDoc?.name, ar.name),
//                 description: buildField(description, stateDoc?.name, cityDoc?.name, ar.name),
//             }));
//         }

//         // CASE 4: state + city + area selected → single post
//         else if (state && city && area) {
//             const stateDoc = await State.findById(state);
//             const cityDoc = await City.findById(city);
//             const areaDoc = await Area.findById(area);
//             locations = [{
//                 state,
//                 city,
//                 area,
//                 title: buildField(title, stateDoc?.name, cityDoc?.name, areaDoc?.name),
//                 metaTitle: buildField(metaTitle || title, stateDoc?.name, cityDoc?.name, areaDoc?.name),
//                 metaDescription: buildField(metaDescription || shortDescription, stateDoc?.name, cityDoc?.name, areaDoc?.name),
//                 shortDescription: buildField(shortDescription, stateDoc?.name, cityDoc?.name, areaDoc?.name),
//                 description: buildField(description, stateDoc?.name, cityDoc?.name, areaDoc?.name),
//             }];
//         }

//         // CREATE POSTS
//         const posts = await Promise.all(
//             locations.map(loc =>
//                 BulkPost.create({
//                     title: loc.title,
//                     slug: slugify(loc.title, { lower: true }),
//                     shortDescription: loc.shortDescription,
//                     description: loc.description,
//                     content,
//                     category,
//                     metaTitle: loc.metaTitle,
//                     metaDescription: loc.metaDescription,
//                     images,
//                     author,
//                     state: loc.state,
//                     city: loc.city,
//                     area: loc.area
//                 })
//             )
//         );

//         return res.status(201).json({
//             message: "Bulk posts created successfully",
//             count: posts.length,
//             posts
//         });

//     } catch (err) {
//         console.error("Error creating bulk post:", err);
//         return res.status(500).json({ error: "Failed to create bulk post" });
//     }
// };



/* ============================================================
   ⭐ UPDATE BULK POST
============================================================ */
export const updateBulkPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BulkPost.findById(id);
        if (!post)
            return res.status(404).json({ error: "Bulk post not found" });

        const {
            title,
            content,
            category,
            state,
            city,
            area,
            isAllState,
            isAllCity,
            isAllArea
        } = req.body;

        // If new images uploaded
        let newImages = req.files?.map(file => file.filename);

        if (newImages && newImages.length > 0) {
            // Delete old images
            post.images.forEach(img => {
                const oldPath = path.join(__dirname, "..", "uploads", img);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            });
            post.images = newImages;
        }

        // Update title & slug
        if (title) {
            post.title = title;
            post.slug = slugify(title, { lower: true });
        }

        if (content) post.content = content;
        if (category) post.category = category;

        // NEW — clean consistent logic
        const locations = handleBulkSelection({
            state,
            city,
            area,
            isAllState,
            isAllCity,
            isAllArea
        });

        post.state = locations.state;
        post.city = locations.city;
        post.area = locations.area;

        const updatedPost = await post.save();

        return res.status(200).json({
            message: "Bulk post updated successfully",
            post: updatedPost
        });

    } catch (err) {
        console.error("Error updating bulk post:", err);
        res.status(500).json({ error: "Failed to update bulk post" });
    }
};



/* ============================================================
   ⭐ DELETE BULK POST
============================================================ */
export const deleteBulkPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BulkPost.findById(id);
        if (!post)
            return res.status(404).json({ error: "Bulk post not found" });

        // Delete images
        post.images.forEach(img => {
            const imgPath = path.join(__dirname, "..", "uploads", img);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });

        await BulkPost.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Bulk post deleted successfully"
        });

    } catch (err) {
        console.error("Error deleting bulk post:", err);
        res.status(500).json({ error: "Failed to delete bulk post" });
    }
};
