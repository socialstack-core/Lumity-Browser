import PageWithSidebar from 'UI/PageWithSidebar';
import DirectorySelect from 'UI/DirectorySelect';


export default function StartScreen(props) {
	
	var sidebar = <>
		{`Sidebar content`}
	</>;
	
	return <PageWithSidebar sidebar={sidebar}>
		{`Main page content`}
		<DirectorySelect />
	</PageWithSidebar>;
}