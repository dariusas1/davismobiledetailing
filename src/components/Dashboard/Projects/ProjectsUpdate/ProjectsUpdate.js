import './ProjectsUpdate.css';

const ProjectsUpdate = ({cancelUpdateProjectBtnClicked}) => {
    return (
        <form className="projects-update">
            <p className="project-update-heading">Update your project</p>
            <input className="project-update-title-input" type="text" placeholder="2020 Tesla Model X" />
            <input className="project-update-files-input" type="file" multiple accept="image/png image/jpg" />
            <div className="project-update-btns">
                <button className="project-update-submit-btn" type="submit">Update</button>
                <button className="project-update-cancel-btn" type="button" onClick={cancelUpdateProjectBtnClicked}>Cancel</button>
            </div>
        </form>
    )
};

export default ProjectsUpdate;
