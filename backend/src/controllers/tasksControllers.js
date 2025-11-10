import Task from "../models/Task.js"

export const getAllTasks = async (req, res) => {

    const { filter = "today" } = req.query;
    const now = new Date();
    let startDate;

    switch(filter){
        case "today" : {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        }
        case "week" : {
            const mondayDate = 
                now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), now.mondayDate);
            break;
        }
        case "month" : {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case "all" :
            default : {
                startDate = null;
            }
    }

    const query = startDate ? { createdAt: { $gte: startDate} } : {};

    try {
        const result = await Task.aggregate([
            { $match: query},
            {
                $facet: {
                tasks: [{ $sort: { createdAt: -1 } }],
                activeCount: [
                    { $match: { status: "active" } },
                    { $count: "count" }
                ],
                completeCount: [
                    { $match: { status: "complete" } },
                    { $count: "count" }
                ],
                },
            },
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        res.status(200).json({ tasks, activeCount, completeCount});

    } catch (error) {
        console.log("Lỗi khi gọi getAllTasks", error)
        res.status(500).json({message: "Lỗi hệ thống"})
    }
}

export const createTasks = async (req, res) => {
    try {
        const {title} = req.body;
        const task = new Task({title});

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log("Lỗi khi gọi createTasks", error)
        res.status(500).json({message: "Lỗi hệ thống"})
    }
}
// do exp chấp nhận update bán phần (PATCH) vẫn được khác với String và dotnec toàn phần (PUT)
export const updateTasks = async (req, res) => {
    try {
        const {title, status, completedAt } = req.body;
        const updateTasks = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            {new : true}
        );

        if(!updateTasks) {
            return req.status(404).json({message: "Nhiệm vụ không tồn tại :< "})
        }

        res.status(200).json(updateTasks);

    } catch (error) {
        console.log("Lỗi khi gọi updateTasks", error)
        res.status(500).json({message: "Lỗi hệ thống"})
    }
}
export const deleteTasks = async(req, res) => {
    try {    
        const deleteTask = await Task.findByIdAndDelete(req.params.id);
        
        if(!deleteTask){
            return res.status(404).json({message: "Nhiệm vụ không tồn tại -_-"})
        }

        res.status(200).json(deleteTask);
    } catch (error) {
        console.log("Lỗi khi gọi deleteTask", error)
        res.status(500).json({message: "Lỗi hệ thống"})
    }
}