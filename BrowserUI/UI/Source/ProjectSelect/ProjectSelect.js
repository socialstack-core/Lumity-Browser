import DirectorySelect from 'UI/DirectorySelect';
import {useProjectList} from 'UI/ProjectList';
import {useRouter} from 'UI/Session';


export default function ProjectSelect(props) {
	
	var {addProject} = useProjectList();
	var {setPage} = useRouter();
	
	return (
		<div className="project-select">
			<DirectorySelect label={`Browse for a Lumity project`} onSelect={dirPath => {
				
				var project = {directory: dirPath, name: 'Unnamed Project'};
				
				// Add the project. This sets an ID on it. 
				// If the directory was already added then it returns the previously saved project instead.
				project = addProject(project);
				
				// Load it now!
				setPage('projects/' + project.id);
				
			}}/>
		</div>
	);
}