import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../../../Shared/Loading/Loading';
import AddIssue from './AddIssue';
import { Issue } from './issue.type'

const List = () => {

    const [modal, setModal] = useState(false)
    const [issues, setIssues] = useState([])

    const { id } = useParams()

    const { data: selectedProject, isLoading, refetch } = useQuery(['selectedProject'], async () =>
        await fetch(`https://dry-eyrie-76820.herokuapp.com/selectedProject/${id}`)
            .then(res => res.json())
    )

    const url = `http://localhost:5000/getTask?projectId=${id}`
    console.log(url)
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => setIssues(data))
    }, [])


    const handleIssue = (e: React.BaseSyntheticEvent<object, any, any>) => {
        e.stopPropagation();
        console.log(e.target.value)

        const issue = {
            projectId: id,
            // dueData: e?.target.data.dueData,
            stage: e?.target.value,
            priority: e?.target.value,
            status: e?.target.value,
        }
        console.log(issue)

        fetch('http://localhost:5000/addTask', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(issue)
        })
            .then(res => res.json())
    }

    // const { data: issues } = useQuery(['issues'], () =>
    //     fetch(`http://localhost:5000/getTask?${selectedProject.projectName}`)
    //         .then(res => res.json())
    //         .then(data => console.log(data))
    // )
    refetch();



    if (isLoading) {
        return <Loading />
    }

    const menuItem =
        <div className='flex items-center'>
            <li>
                <button onClick={() => setModal(true)} className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md  hover:shadow-lg btn-secondary hover:bg-secondary-focus focus:shadow-lg  focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mr-1.5" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">+ Add Issue</button>
            </li>
        </div>

    return (
        <div>
            <div>
                <div className='navbar text-secondary sticky'>
                    <div className='container mx-auto'>
                        <div className="navbar-start">
                            <div className="dropdown">
                                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                                </label>
                                <ul tabIndex={0} className="menu-compact dropdown-content mt-3 p-2 rounded-box w-52">
                                    {menuItem}
                                </ul>
                            </div>
                            <Link to='/' className="normal-case px-5 py-2 font-medium text-xl">{selectedProject.projectName}</Link>
                        </div>

                        <div className="navbar-end lg:flex">
                            <ul className="menu-horizontal p-0">
                                {menuItem}
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        modal && <AddIssue projectId={selectedProject._id} setModal={setModal} />
                    }
                </div>

            </div>

            <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="h-16 w-full font-semibold text-left text-sm leading-none text-gray-800">
                            <th className="pl-12">Issue Name</th>
                            <th className="pl-12">Issue Description</th>
                            <th className="pl-20">Stage</th>
                            <th className="pl-20">Priority</th>
                            <th className="pl-16">Status</th>
                            <th className="pl-20">Due Date</th>
                            <th className="pl-20">Assigned Person</th>
                            <th className="pl-20">Action</th>
                        </tr>
                    </thead>

                    {issues?.map((issue: Issue) => <>
                        <tbody className="w-full">
                            <tr className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100">
                                <td className="pl-12">
                                    <p className="text-sm font-medium leading-none text-gray-800">{issue.issueName}</p>
                                </td>
                                <td className="pl-12">
                                    <p className="font-medium">{issue.description}</p>
                                </td>

                                <td className="pl-20">
                                    <select name='stage' onChange={handleIssue} className="select bg-inherit font-medium focus:outline-0 focus:border-secondary">
                                        <option value={issue.stage}>{issue.stage}</option>
                                        <option value='To Do'>To Do</option>
                                        <option value='In Progress'>In Progress</option>
                                        <option value='Done'>Done</option>
                                    </select>
                                </td>

                                <td className="pl-20">
                                    <select name='priority' onChange={handleIssue} className="select bg-inherit font-medium focus:outline-0 focus:border-secondary">
                                        <option value={issue.priority}>{issue.priority}</option>
                                        <option value='Low'>Low</option>
                                        <option value='Normal'>Normal</option>
                                        <option value='High'>High</option>
                                    </select>
                                </td>

                                <td className="pl-20">
                                    <select name='status' onChange={handleIssue} className="select bg-inherit font-medium focus:outline-0 focus:border-secondary">
                                        <option value={issue.status}>{issue.status}</option>
                                        <option value='On Track'>On Track</option>
                                        <option value='At Risk'>At Risk</option>
                                        <option value='Off Track'>Off Track</option>
                                    </select>
                                </td>

                                <td className="pl-20">
                                    {/* <p className="font-medium">{issue.dueData}</p> */}
                                    <input
                                        type="date"
                                        className="input font-medium focus:outline-0 focus:border-secondary rounded-sm bg-inherit"
                                        defaultValue={issue.dueData}
                                    />
                                </td>

                                <td className="pl-16">
                                    <div className="flex items-center">
                                        <img className="shadow-md w-8 h-8 rounded-full" src="https://cdn.tuk.dev/assets/templates/olympus/projects(8).png" alt='' />
                                        <img className="shadow-md w-8 h-8 rounded-full -ml-2" src="https://cdn.tuk.dev/assets/templates/olympus/projects(9).png" alt='' />
                                    </div>
                                </td>

                                <td className="pl-20">
                                    <div className="font-medium">
                                        <Link to={`#`} className="btn btn-sm btn-secondary">Edit</Link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </>)
                    }
                </table>
            </div>
        </div>
    );
};

export default List;