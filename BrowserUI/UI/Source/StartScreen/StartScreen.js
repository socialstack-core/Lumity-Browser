import PageWithSidebar from 'UI/PageWithSidebar';
import ProjectList from 'UI/ProjectList';
import ProjectSelect from 'UI/ProjectSelect';


export default function StartScreen(props) {
	
	var sidebar = <>
		<ProjectList />
	</>;
	
	return <PageWithSidebar sidebar={sidebar}>
		{`Main page content`}
		<ProjectSelect />
	</PageWithSidebar>;
}