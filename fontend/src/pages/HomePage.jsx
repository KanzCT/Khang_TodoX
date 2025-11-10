import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx';
import AddTask from '../components/AddTask.jsx';
import StatsAndFilters from '../components/StatsAndFilters.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskListPagination from '../components/TaskListPagination.jsx';
import DateTimeFilter from '../components/DateTimeFilter.jsx';
import Footer from '../components/Footer.jsx';
import { toast } from 'sonner';
import api from '../lib/axios.js';
import { visibleTaskLimit } from '../lib/data.js';


const HomePage = () => {

  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0)
  const [completeTaskCount, setCompleteTaskCount] = useState(0)
  const [filter, setFilter] = useState('all')
  const [dateQuery, setDateQuery] = useState('today');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]); // đổi bộ lộc fetch data

  useEffect(() => {
    setPage(1);
  },[filter, dateQuery])

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.log("lỗi xảy ra khi truy xuất stask: ", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks: ");
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if(page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if(page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter){
      case "active":
        return task.status === 'active';
      case "completed":
        return task.status === 'complete';
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page-1) * visibleTaskLimit, // 
    page * visibleTaskLimit // số trang x số lượng thẻ view = vị trí end
  )
  // trang 1 : 1-1 * 4 = 0, 1 * 4 = 4
  // trang 2 : 2-1 * 4 = 4, 2 * 4 = 8
  // trang 3 : 3-1 * 4 = 8, 3 * 4 = 12

  if(visibleTasks.length === 0){
    handlePrev();
  }

  // tổng số trang = tổng số lượng nhiệm vụ / số lượng view của 1 trang
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit)
  
  return (

  <div className="min-h-screen w-full bg-[#fefcff] relative overflow-hidden">
  {/* Dreamy Sky Pink Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)
      `,
    }}
  />
  {/* Your Content/Components */}
  <div className='container mx-auto relative z-10'>
      <div className='w-full max-w-2xl p-6 mt-8 mx-auto space-y-6'>

        {/* Đầu trang */}
        <Header />

        {/* Tạo nhiệm vụ */}
        <AddTask handleNewTaskAdded={handleTaskChanged}/>

        {/* thống kê và bộ lọc */}
        <StatsAndFilters 
          filter={filter}
          setFilter={setFilter}
          activeTasksCount={activeTaskCount}
          completedTaskCount={completeTaskCount}
        />

        {/* Danh sách nhiệm vụ */}
        <TaskList FilteredTasks={visibleTasks} filter={filter}
          handleTaskChanged={handleTaskChanged}
        />

        {/* Phân trang và bộ lọc Date */}
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          <TaskListPagination
            handleNext={handleNext}
            handlePrev={handlePrev}
            handlePageChange={handlePageChange}
            page={page}
            totalPages={totalPages}
          />
          <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
        </div>

        {/* Chân Trang */}
        <Footer
          activeTaskCount={activeTaskCount}
          completedTaskCount={completeTaskCount}
        />
      </div>
    </div>
</div>
  );
};

export default HomePage