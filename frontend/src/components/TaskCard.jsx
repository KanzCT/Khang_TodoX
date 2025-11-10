import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils'
import api from '../lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';

const TaskCard = ({task, index, handleTaskChanged }) => {

    const [isEditting, setIsEditting] = useState(false);
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
    
    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success(`Nhiệm vụ ${task.title} đã được xóa.`);
            handleTaskChanged();
        } catch (error) {
            console.error("Lỗi xảy ra khi xóa Task.", error);
            toast.error("Lỗi xảy ra khi xóa nhiệm vụ");
        }
    }

    const updateTask = async () => {
        try {
            setIsEditting(false);
            await api.put(`/tasks/${task._id}`, {
                title: updateTaskTitle
            });
            toast.success(` Nhiệm vụ đã đổi thành ${updateTaskTitle}`)
            handleTaskChanged();
        } catch (error) {
            console.error("Lỗi xảy ra khi update Task.", error);
            toast.error("Lỗi xảy ra khi update nhiệm vụ");
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            updateTask();
        }
    }

    const toggleTaskComplete = async () => {
        try {
            if(task.status === "active"){
                await api.put(`/tasks/${task._id}`,{
                    status: "complete",
                    completedAt: new Date().toISOString(),
                });
                toast.success(`${task.title} đã hoàn thành.`)
            }else{ // trạng thái hoàn thành rồi
                await api.put(`/tasks/${task._id}`, {
                    status: "active",
                    completedAt: null,
                });
                toast.success(`${task.title} đã đổi sang chưa hoàn thành.`);
            }

            handleTaskChanged();
        } catch (error) {
            console.error("Lỗi xảy ra khi update Task.", error);
            toast.error("Lỗi xảy ra khi update nhiệm vụ");
        }
    }


  return (
    <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition duration-200 animate-fade-in group",
            task.status === "complete" && "opacity-75"
    )}
        style={{ animationDelay: `${index * 50}ms `}}
    >
        <div className='flex items-center gap-4'>
            {/* Nút tròn */}
            <Button variant='ghost' size='icon' className={cn(
                'shrink-0 size-8 rounded-full transition-all duration-200',
                task.status === "complete" ? 'text-success hover:text-sucess/80' :
                "text-muted-foreground hover:text-primary"
                )}
                onClick={toggleTaskComplete}
            >
                {task.status === 'complete' ? 
                (<CheckCircle2 className='size-5'/>) :
                (<Circle className='size-5'/>)}
            </Button>

            {/* Hiển thị chỉnh sữa tiêu đề + Ngày tạo date hoàn thành*/}
            <div className='flex-1 min-w-0'>
                {/* Hiển thị chỉnh sữa tiêu đề  */}
                {isEditting ? (
                    <Input type="text" placeholder="Cần phải làm gì?"
                        className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                        value={updateTaskTitle}
                        onChange={(e) => setUpdateTaskTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setIsEditting(false);
                            setUpdateTaskTitle(task.title || "")
                        }}
                    />
                ) : (
                <p className={cn(
                        "text-base transition-all duration-200",
                        task.status === "complete" ?
                        "line-through text-muted-foreground" :
                        "text-foreground"
                    )}
                >
                    {task.title}
                </p>
                )}
                 {/* Ngày tạo và ngày hoàn thành */}
                <div className='flex items-center gap-2 mt-1'>
                    <Calendar className='size-3 text-muted-foreground'/>
                    <span className='text-xs text-muted-foreground'>
                        {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    {task.completedAt && (
                        <>
                            <span className='text-xs text-muted-foreground'> - </span>
                            <Calendar className='size-3 text-muted-foreground'/>
                            <span className='text-xs text-muted-foreground'>
                                {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                        </>
                    )}
                </div>
            </div>


            {/* Nút chỉnh và xóa */}
            <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'>
                {/* Nút edit */}
                <Button variant="ghost" size="icon" className="shrink-0 transition-colors
                 size-8 text-muted-foreground hover:text-info"
                 onClick={() => {
                    setIsEditting(true);
                    setUpdateTaskTitle(task.title || "")
                 }}>
                    <SquarePen className='size-4'/>
                </Button>
                {/* nút xóa */}
                <Button variant="ghost" size="icon" className="shrink-0 transition-colors
                 size-8 text-muted-foreground hover:text-destructive" onClick={() => deleteTask(task._id)}>
                    <Trash2 className='size-4'/>
                </Button>
            </div>
        </div>
    </Card>
  )
}

export default TaskCard