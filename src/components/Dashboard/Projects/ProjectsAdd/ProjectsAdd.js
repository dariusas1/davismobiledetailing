import './ProjectsAdd.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const ProjectsAdd = ({ cancelAddProjectBtnClicked }) => {
    const {
        project,
        setProject,
        handleProjectSubmit
    } = useContext(AppContext);
    return (
        <form className="projects-add">
            <p className="project-add-heading">Add a new project</p>
            <input className="project-add-title-input"
                type="text"
                placeholder="2020 Tesla Model X"
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                value={project.title}
            />
            <input className="project-add-files-input"
                type="file"
                // multiple
                // accept="image/png image/jpg"
                onChange={(e) => setProject({ ...project, img: e.target.files[0] })}
                value={project.img}
            />
            <div className="project-add-btns">
                <button className="project-add-submit-btn" type="submit" onClick={handleProjectSubmit}>Add</button>
                <button className="project-add-cancel-btn" type="button" onClick={cancelAddProjectBtnClicked}>Cancel</button>
            </div>
        </form>
    )
};

export default ProjectsAdd;
