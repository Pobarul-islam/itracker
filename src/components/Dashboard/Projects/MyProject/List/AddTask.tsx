import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import auth from '../../../../../firebase.init';
import { Task } from '../../../../../types/task.type';
import Loading from '../../../../Shared/Loading/Loading';

type AddTaskProps = {
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    projectId: string
}

const AddTask = ({ projectId, setModal }: AddTaskProps) => {

    const { register, handleSubmit } = useForm<Task>();
    const onSubmit: SubmitHandler<Task> = async (data, e) => {
        const task = {
            projectId: projectId,
            taskName: data.taskName,
            description: data.description,
            email: data.email,
            dueData: data.dueData,
            stage: e?.target.stage.value,
            priority: e?.target.priority.value,
            status: e?.target.status.value,
        }

        fetch('https://itracker-server.vercel.app/addTask', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })
            .then(res => res.json())

        swal({
            title: "Congrats!",
            text: "Task added Successfully!",
            icon: "success",
        });
        setModal(false);

    };

    const [user, loading] = useAuthState(auth)

    if (loading) {
        <Loading />
    }

    return (
        <div className='relative'>
            <div className="offcanvas offcanvas-end fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 top-0 right-0 border-none w-full lg:w-2/5" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header flex items-center justify-between p-4">
                    <h5 className="offcanvas-title mt-10 ml-5 text-xl leading-normal" id="offcanvasRightLabel"><span className='text-secondary font-semibold'>{user?.displayName}!</span> Create your new issue here.</h5>
                </div>
                <div className="offcanvas-body flex-grow px-4 overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-5">
                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Task Title</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Task Title"
                                className="input input-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full"
                                {...register("taskName", {
                                    required: {
                                        value: true,
                                        message: "Name is required"
                                    }
                                })}
                            />
                        </div>

                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>

                            <textarea
                                placeholder="Enter Description"
                                className="input input-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full"
                                {...register("description")}
                            />
                        </div>

                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Assign Member</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Invite Your Team Member"
                                className="input input-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full"
                                {...register("email", {
                                    pattern: {
                                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please enter valid email address'
                                    }
                                })} />
                        </div>


                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Due Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full"
                                {...register("dueData", {
                                    required: {
                                        value: true,
                                        message: "Due is required"

                                    }
                                })}
                            />
                        </div>

                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Working Stage</span>
                            </label>
                            <select name='stage' className="select select-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full">
                                <option>To Do</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>

                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Priority</span>
                            </label>

                            <select name='priority' className="select select-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>

                        </div>

                        <div className="form-control w-full mx-auto">
                            <label className="label">
                                <span className="label-text">Status</span>
                            </label>
                            <select name='status' className="select select-bordered focus:outline-0 focus:border-secondary rounded-sm bg-white w-full">
                                <option>On Track</option>
                                <option>At Risk</option>
                                <option>Off Track</option>
                            </select>
                        </div>

                        <div className="w-full mx-auto m-5">
                            <input className='btn-secondary rounded-sm text-white py-2 font-medium px-6' type="submit" value="Add Issue" />
                            <button onClick={() => setModal(false)} className='btn-secondary ml-5 rounded-sm text-white py-2 font-medium px-6'>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTask;