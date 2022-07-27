
export default function DirectorySelect(props) {
	
	return (
		<div className="directory-select">
			<button className="btn btn-primary" onClick={() => {
				if(window.electronApi){
					
					window.electronApi.selectFolder().then(dirName => {
						props.onSelect && props.onSelect(dirName);
					});
					
				}else{
					// <input type="file" webkitdirectory="true" /> sort of works, but really just selects all the files in the directory. If there aren't any it fails.
					alert('Feature not available in developer UI instances. You\'ll need to build the UI and display it in the electron app to use this feature. Faking a path instead.');
					
					props.onSelect && props.onSelect('/var/projects/lumity/test-project/');
				}
			}}>{props.label || `Browse for a directory`}</button>
		</div>
	);
	
}