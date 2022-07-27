import storage from 'UI/Functions/Store';

const ProjectListContext = React.createContext();
export { ProjectListContext };

export function useProjectList(){
	// returns {projectList, addProject}
	return React.useContext(ProjectListContext);
}

export const Provider = (props) => {
	const [projectList, setProjectList] = React.useState(() => {
		// Ask storage for the list of projects:
		var projectSet = storage.get('projects') || [];
		
		return projectSet;
	});
	
	var addProject = (project) => {
		
		// If already in the set, do nothing.
		if(projectList){
			var existing = projectList.find(proj => proj.directory == project.directory);
			
			if(existing){
				return existing;
			}
		}
		
		var newProjectList = [
			...projectList,
			project
		];
		
		// Set a local ID:
		project.id = newProjectList.length;
		
		// Set in to storage:
		storage.set('projects', newProjectList);
		
		// Re-render anything that is dependent on the list:
		setProjectList(newProjectList);
		
		// Return the object with the provided ID:
		return project;
	};
	
	return (
		<ProjectListContext.Provider
			value={{
				projectList,
				addProject
			}}
		>
			{props.children}
		</ProjectListContext.Provider>
	);
};

export const ProjectListConsumer = (props) => <ProjectListContext.Consumer>{v => props.children(v.projectList, v.addProject)}</ProjectListContext.Consumer>;

export default function ProjectList(props) {
	
	var {projectList} = useProjectList();
	
	return (
		<div className="project-list">
			{projectList.length ? projectList.map(project => {
				
				return <a href={'/projects/' + project.id}>
					<div className="project-list__project">
						<h3>
							{project.name}
						</h3>
						<div className="project-list__project-location">
							{project.directory}
						</div>
					</div>
				</a>;
				
			}) : `No projects added yet`}
		</div>
	);
}