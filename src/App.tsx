import "./App.css";

import { v4 as uuidv4 } from "uuid";

import { useState, ChangeEvent, useRef, useEffect } from "react";

import { BsFillSunFill, BsTrash } from "react-icons/bs";
import { TbSquareRoundedArrowRight } from "react-icons/tb";
import { FcTodoList, FcCheckmark, FcHighPriority } from "react-icons/fc";

// import bgday from "./assets/images/bg-day.jpg";
// style={{ backgroundImage: `url(${bgday})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}

interface Task {
  id: string;
  name: string;
  isChecked: boolean;
  isCompleted: boolean;
}

function App() {
  const [task, setTask] = useState<Task>({
    id: "",
    name: "",
    isChecked: false,
    isCompleted: false,
  });

  const [taskList, setTaskList] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks): []
  });

  const [darkTheme, setDarkTheme] = useState(false);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [incompletedTaskCount, setIncompletedTaskCount] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const defineTask = (event: ChangeEvent<HTMLInputElement>) => {
    setTask({
      id: uuidv4(),
      name: event.target.value,
      isChecked: false,
      isCompleted: false,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      saveTaskList();
    }
  };

  const handleCheckboxChange = (taskId: string) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isChecked: !task.isChecked,
              isCompleted: !task.isCompleted,
            }
          : task
      )
    );
  };

  const saveTaskList = () => {
    if (task.name.trim() !== "") {
      setTaskList([...taskList, task]);
      setTask({ ...task, name: "" });
      inputRef.current?.focus();
    }
  };

  const deleteTask = (taskId: string) => {
    const updateTasks = taskList.filter((task) => task.id !== taskId);
    setTaskList(updateTasks);
  };

  const changeTheme = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(() => {
    const completedTasks = taskList.filter((task) => task.isCompleted);
    setCompletedTaskCount(completedTasks.length);

    const incompletedTasks = taskList.filter((task) => !task.isCompleted);
    setIncompletedTaskCount(incompletedTasks.length);
  }, [taskList]);

  useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(taskList));
  })

  const deleteCompletedTasks = () => {
    if (taskList.length > 0) {
      const completedTasksToDelete = taskList.filter(
        (task) => !task.isCompleted
      );
      setTaskList(completedTasksToDelete);
    }
  };

  const clearTaskList = () => {
    if (taskList.length > 0) {
      setTaskList([]);
    }
  };

  return (
    <>
      <div className="containers w-full">
        <div className="card mx-auto max-w-4xl">
          <div className="top-header flex justify-between items-center mx-10 pt-16">
            <h1 className="text-4xl uppercase font-bold text-white">To do</h1>
            <div className="icon text-white ">
              <button onClick={changeTheme}>
                <BsFillSunFill size={20} />
              </button>
            </div>
          </div>
          <div className="task-card m-10 flex flex-col gap-5">
            <div className="top-task">
              <div className="overview text-[#8d94a0]">
                <div className="flex justify-between mb-3">
                  {taskList.length <= 1 ? (
                    <span className="total-tasks flex items-center gap-2">
                      <FcTodoList />
                      <span>{taskList.length} item in total</span>
                    </span>
                  ) : (
                    <span className="total-tasks flex items-center gap-2">
                      <FcTodoList />
                      <span>{taskList.length} itens in total</span>
                    </span>
                  )}
                  <div>
                    <span className="incompleted-tasks flex items-center gap-2">
                      <FcHighPriority />
                      <span>{incompletedTaskCount} incompleted</span>
                    </span>
                  </div>
                  <div>
                    {completedTaskCount >= 1 ? (
                      <span className="incompleted-tasks flex items-center gap-2">
                        <FcCheckmark />
                        <span>{completedTaskCount} completed</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FcCheckmark />
                        <span>0 completed</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mb-1">
                  <button onClick={deleteCompletedTasks}>
                    Delete completed
                  </button>
                  <button onClick={clearTaskList}>Clear all list</button>
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Create a new todo..."
                  className="pl-5 w-full h-12 rounded bg-[#25273c] text-[#8d94a0]"
                  ref={inputRef}
                  onChange={defineTask}
                  value={task.name}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={saveTaskList}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2"
                >
                  <TbSquareRoundedArrowRight
                    size={20}
                    className="text-[#3260c0] hover:text-yellow-500"
                  />
                </button>
              </div>
            </div>
            <div className="tasks rounded bg-[#25273c] min-h-[200px] text-[#8d94a0]">
              {taskList.length > 0 ? (
                ""
              ) : (
                <div className="flex items-center justify-center gap-5 mt-16">
                  <h1 className="text-[30px]">There's no todo</h1>
                  <FcTodoList size={30}/>
                </div>
              )}
              {taskList.map((task) => (
                <div
                  key={task.id}
                  className={`task border border-[#8d94a0] p-2 m-2 rounded flex justify-between ${
                    task.isChecked ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="input-element"
                      onChange={() => handleCheckboxChange(task.id)}
                      checked={task.isChecked}
                    />
                    <span
                      className={`pl-1 ${task.isChecked ? "line-through" : ""}`}
                    >
                      {task.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                    }}
                    className="pr-1"
                  >
                    <BsTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
