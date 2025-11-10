import React from 'react'
import { Card } from './ui/card'
import { Circle } from 'lucide-react'

const TaskEmptyState = ({filter}) => {
  return (
    <Card className='p-8 text-center border-0 bg-gradient-card shadow-custom-md'>
    <div>
        <Circle className='mx-auto mt-2 size-12 text-muted-foreground'/>
        <h3 className='font-medium text-foreground mt-3.5'>
            {filter==='active' ? " không có nhiệm vụ nào đang làm." : 
             filter==='completed' ? "chưa có nhiệm vụ nào hoàn thành." :
             "chưa có nhiệm vụ."}
        </h3>
        <p className='text-sm text-muted-foreground'>
            {filter === 'all' ? " thêm nhiệm vụ đầu tiên nka ^^" :
            ` chuyển sang "tất cả" để thấy những nhiệm vụ hé ${filter==="active" ? "đã hoàn thành." : "đang làm."} `}
        </p>
    </div>
    </Card>
  )
}

export default TaskEmptyState