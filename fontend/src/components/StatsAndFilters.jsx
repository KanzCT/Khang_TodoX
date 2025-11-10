import { Badge } from './ui/badge'
import { FilterType } from '../lib/data'
import { Filter } from 'lucide-react'
import { Button } from './ui/button'

const StatsAndFilters = ( { completedTaskCount=0, activeTasksCount=0, filter = 'all', setFilter } ) => {
  return (
    <div className='flex flex-col gap-4 items-start justify-between md:flex-row sm:items-center'>
      {/* Phần bên trái CountTasks ( Thống kê )*/}
      <div className='flex gap-3'>
        <Badge variant={'secondary'} 
        className='bg-white/50 text-accent-foreground border-info/20' >
          {activeTasksCount} {FilterType.active}
        </Badge>
        <Badge variant={'secondary'} 
        className='bg-white/50 text-success border-success/20' >
          {completedTaskCount} {FilterType.completed}
        </Badge>
      </div>

      {/* Phần bộ lộc Filter */}
      <div className='flex flex-col gap-2 sm:flex-row'>
        {
          Object.keys(FilterType).map((type) => (
            <Button key={type} variant={filter===type ? 'gradient' : 'ghost' }
            size='sm' className='capitalize' onClick={() => setFilter(type)}>
              <Filter className='size-4'/> {FilterType[type]}
            </Button>
          ))
        }
      </div>
    </div>
  )
}

export default StatsAndFilters