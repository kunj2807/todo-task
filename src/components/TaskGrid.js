import React, { useEffect } from "react";
import { Draggable, Droppable } from "react-drag-and-drop";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, getUserTaks } from "../store/task";
import DraggableBox from "./DraggableBox";
import { Row } from "react-bootstrap";

export default function TaskGrid() {
  const statusColor = {
    todo: { color: "info", title: "To do" },
    inprogress: { color: "primary", title: "In progress" },
    done: { color: "success", title: "Done" },
  };
  const handleDrop = async (obj, status) => {
    let old_status = Object.keys(obj).find((item) => obj[item]);
    await dispatch(
      changeStatus({ status: status, id: obj[old_status] })
    ).unwrap();
    dispatch(getUserTaks());
  };
  const dispatch = useDispatch();
  const userTasks = useSelector((state) => state.task.userTasks);

  useEffect(() => {
    dispatch(getUserTaks());
  }, []);

  return (
    <>
      <div>
        <div className="d-flex gap-3 justify-content-between overflow-auto">
          {Object.keys(statusColor).map((item, index) => {
            return (
              <Droppable
                key={index}
                className="column"
                types={[...Object.keys(statusColor)]}
                onDrop={(e)=>handleDrop(e,item)}
              >
                <div className="border rounded h-100 p-2">
                  <h4
                    align="center"
                    className={`text-light border-bottom m-0 p-2 bg-${statusColor[item].color} position-sticky`}
                  >
                    {statusColor[item].title}
                  </h4>
                  <Row
                    className="m-0 p-3 gap-2 overflow-auto column-row"
                    id={item}
                  >
                    {userTasks &&
                      userTasks[item]?.map((task) => {
                        return (
                          <Draggable
                            type={item}
                            data={task.id}
                            key={task.id}
                            className="p-0"
                            id={item}
                          >
                            <DraggableBox data={task} />
                          </Draggable>
                        );
                      })}
                  </Row>
                </div>
              </Droppable>
            );
          })}
        </div>
      </div>
    </>
  );
}
