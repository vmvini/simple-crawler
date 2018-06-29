## Steps

<dl>
  <dt>Install nodejs v6 or higher</dt>
  <dt>Install the dependencies inside this directory with: </dt>
  
  `npm install`
  
  <dt>(LINUX) Start the app providing the txt file path</dt>
  
  `npm start ~/Downloads/example.txt`
  
  <dt>On Windows you should put the file path between quotation marks</dt>
  
  `npm start 'C:\Downloads\example.txt'`
  
  <dt>Also you can define how many pages the app should download simultaneously</dt>
  
  `npm start 'C:\Downloads\example.txt' 100`
  
  In this case, if you have 200 pages in the txt file, the app will download first 100 pages simultaneously, 
and after complete the batch, it will download the rest. 
  
</dl>