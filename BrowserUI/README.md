# Lumity Browser

This project is made with SocialStack. To start developing or running this project, you'll first need to install the dependencies. To learn more about the dependencies (and socialstack in general), take a look at the [developer getting started guide](https://source.socialstack.dev/documentation/guide/blob/master/DeveloperGuide/Readme.md).


## First time setup

If you have all the dependencies installed, you'll next need to create the database. Run this in a terminal cd'd to the project:

```
socialstack init
```

Next, you'll need to populate the database. Ask someone else on the development team of this project to provide a database dump for you to use - They may have already done this in a directory called `Database` in the repository. It's just a .sql file, so open it up in e.g. MySQL Workbench and apply it to the database. 

If you're not sure what the database is called or missed it (`socialstack init` would have displayed its name in your console), you can check for its name in `appsettings.json`.

## Running the project

Follow [the guide here](https://source.socialstack.dev/documentation/guide/blob/master/DeveloperGuide/Readme.md#running-a-project) on starting up the project. If you skip getting a database dump, this will automatically generate tables for you, but they'll be empty.


## Building for the Electron app

The development loop is primarily a regular, fast purely in browser one. However there will be certain features that are Electron only (such as selecting a directory and reading the Lumity files from it), so you may want to check how things are looking in the Electron app itself.

To do that, firstly make sure the project is running as above. This will keep the UI compiled and also provide the API necessary for listing the available screens (pages) of the project. Note that the Electron app won't ever actually interact with this API - it is purely for development support in this project. To update the files in the Electron project, run the following:

> socialstack buildapp -apiUrl -instanceUrl http://localhost:5050

Socialstack tools can see in the appsettings.json the location of the Electron project and will then output the files there. Note that no actual compilation happens during this command - it is simply using in memory information in the running API - so it tends to complete very quickly.