
export default function DirectorySelect(props) {
	
	return (
		<div className="directory-select">
			<button className="btn btn-primary" onClick={() => {
				if(window.electronApi){
					
					window.electronApi.selectFolder().then(dirName => {
						
						console.log(dirName);
						
					})
					
				}else{
					// <input type="file" webkitdirectory="true" /> sort of works, but really just selects all the files in the directory. If there aren't any it fails.
					alert('Feature not available in developer UI instances. You\'ll need to build the UI and display it in the electron app to use this feature.');
				}
			}}>Browse for a Lumity directory</button>
		</div>
	);
	
}