import ProjectsAdd from '../../components/Dashboard/Projects/ProjectsAdd/ProjectsAdd';
import ProjectsView from '../../components/Dashboard/Projects/ProjectsView/ProjectsView';
import ProjectsUpdate from '../../components/Dashboard/Projects/ProjectsUpdate/ProjectsUpdate';
import { useContext } from 'react';
import { AppContext } from '../../App';

const Projects = () => {
    const {
        projectsIsAdding,
        setProjectsIsAdding,
        projectsIsUpdating,
        setProjectsIsUpdating,
        setProjectWarning,
        setProject
    } = useContext(AppContext);

    const addProjectBtnClicked = () => {
        setProjectsIsAdding(true);
    }

    const cancelAddProjectBtnClicked = () => {
        setProjectsIsAdding(false);
        setProjectWarning("");
        setProject({ title: "", img: "" });
    }

    const updateProjectBtnClicked = () => {
        setProjectsIsUpdating(true);
    }

    const cancelUpdateProjectBtnClicked = () => {
        setProjectsIsUpdating(false);
    }

    return (
        <>
            {
                !projectsIsAdding && !projectsIsUpdating
                &&
                <ProjectsView addProjectBtnClicked={addProjectBtnClicked} updateProjectBtnClicked={updateProjectBtnClicked} />
            }
            {
                projectsIsAdding
                &&
                <ProjectsAdd cancelAddProjectBtnClicked={cancelAddProjectBtnClicked} />
            }
            {
                projectsIsUpdating
                &&
                <ProjectsUpdate cancelUpdateProjectBtnClicked={cancelUpdateProjectBtnClicked} />
            }
        </>
    )
};

export default Projects;
