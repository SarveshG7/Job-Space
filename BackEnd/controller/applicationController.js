const ApplicationModel = require("../models/applicationModel.js");
const JobModel = require("../models/jobModel.js");

const applyJob = async (req,res)=>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job id is required",
                success:false
            })
        };
        // check if the user has already applied or not for this job
        const existingApplication = await ApplicationModel.findOne({job:jobId, applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false
            });
        };

        //check is the job exist or not
        const job = await JobModel.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not found",
                success:false
            })
        }

        //create a new application
        const newApplication = await ApplicationModel.create({
            job:jobId,
            applicant:userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully",
            success:true
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getAppliedJobs = async (req,res) => {
    try{
        const userId = req.id;
        const application = await ApplicationModel.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}}
            }
        });

        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        }

        return res.status(200).json({
            application,
            success:true
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

//for admin to see how many users have applied
const getApplicants = async (req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await JobModel.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        };

        return res.status(200).json({
            job,
            success:true
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const updateStatus = async (req,res)=>{
    try{
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        }

        //find the application by application id
        const application = await ApplicationModel.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Aplication not found",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = { applyJob , getAppliedJobs , getApplicants, updateStatus };