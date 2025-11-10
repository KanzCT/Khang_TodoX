import { Plus } from 'lucide-react';
import { Button } from './ui/button.jsx' 
import { Card } from './ui/card.tsx';
import { Input } from './ui/input.tsx';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../lib/axios.js';

const AddTask = ({handleNewTaskAdded}) => {

  const [newTaskTitle, setNewTaskTitle] = useState(""); // chuỗi nhập ô input
  const AddTask = async () => { // gửi yêu cầu tạo task lên server
    if(newTaskTitle.trim()){ // cắt khoảng trắng đầu cúi
      try {
        await api.post("/tasks", {title: newTaskTitle})
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào.`)
        handleNewTaskAdded();
      } catch (error) {
        console.log("Lỗi xảy ra khi thêm task.", error);
        toast.error("lỗi xảy ra khi thêm nhiệm vụ mới.");
      }
      setNewTaskTitle("")
    }else{
      toast.error("Bạn cần nhập nội dung của nhiệm vụ")
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      AddTask();
    }
  }


  return (
    <Card className='p-6 border-0 bg-gradient-card shadow-custom-lg'>
      <div className='flex flex-col gap-3 md:flex-row'>
        <Input type='text' placeholder='cần phải làm gì ta?'
        className='h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20'
        value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={handleKeyDown}>
        </Input>

        <Button variant={'gradient'} size={'xl'} className='px-6' onClick={AddTask} disabled={!newTaskTitle.trim()}>
          <Plus className='size-5'/> Thêm
        </Button>
      </div>
    </Card>

  )
}

export default AddTask