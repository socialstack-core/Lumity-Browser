import {useProjectList} from 'UI/ProjectList';
import {useRouter} from 'UI/Session';
import PageWithSidebar from 'UI/PageWithSidebar';
import Alert from 'UI/Alert';
import TransactionList from 'UI/Transaction/List';


export default function ProjectView(props) {
	
	// Get page state - we'll use this to establish the project ID.
	var {pageState} = useRouter();
	
	// Get the project list state:
	var {projectList} = useProjectList();
	
	if(!pageState || !pageState.tokens || !pageState.tokens.length){
		return <Alert type='error'>{`No project ID provided. The url must be /project/{number_here}`}</Alert>;
	}
	
	var id = parseInt(pageState.tokens[0]);
	
	if(!id){
		return <Alert type='error'>{`Provided project ID must be numeric.`}</Alert>;
	}
	
	// Get project info (incl. the directory).
	var project = projectList.find(proj => proj.id == id);
	
	if(!project){
		return <Alert type='error'>{`Project with ID ${id} doesn't exist in your local storage.`}</Alert>;
	}
	
	var sidebar = <>
		{project.name}
	</>;
	
	return <PageWithSidebar sidebar={sidebar}>
		<TransactionList project={project} />
	</PageWithSidebar>;
}