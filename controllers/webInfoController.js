import WebInfo from '../models/webInfo.js';


// ✅ Create or Upsert
export const createOrUpsertWebInfo = async (req, res) => {
  try {


  
    console.log("req.body ====>",req.body)
    
   
    const { address, phoneNo, email, facebook, twitter, instagram, linkedIn } = req.body;

    const response = await WebInfo.findOneAndUpdate(
      {}, // always update the single doc
      { $set: { address, phoneNo, email, facebook, twitter, instagram, linkedIn } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Record created or updated successfully',
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in POST request',
      error: error.message,
    });
  }
};

// ✅ Read (Get One)
export const getWebInfo = async (req, res) => {
  try {
   
    const data = await WebInfo.findOne();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message,
    });
  }
};

// ✅ Update by ID
export const updateWebInfo = async (req, res) => {
  try {
   
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required for update',
      });
    }

    const updated = await WebInfo.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({
      success: true,
      message: 'Record updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating record',
      error: error.message,
    });
  }
};

// ✅ Delete by ID
export const deleteWebInfo = async (req, res) => {
  try {
   
    const { id } = req.query; // Express -> req.query for ?id=...

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required for delete',
      });
    }

    const deleted = await WebInfo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting record',
      error: error.message,
    });
  }
};
