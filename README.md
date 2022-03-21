# Jquery-lined-textarea

[![Written in Html5](https://img.shields.io/static/v1?message=HTML5&labelColor=FF7800&color=FFFFFF&logoColor=white&label=%20&logo=Html5)](https://www.w3schools.com/html/default.asp)
[![Written in Css3](https://img.shields.io/static/v1?message=CSS3&labelColor=509DD4&color=FFFFFF&logoColor=white&label=%20&logo=Css3)](https://www.w3schools.com/css/default.asp)
[![Written in Jquery](https://img.shields.io/static/v1?message=JQuery&labelColor=509DD4&color=FFFFFF&logoColor=white&label=%20&logo=Jquery)](https://jquery.com/)

## Synopsis

> Displays a line number to the left of the textarea.   
> you can easily use if jquery library is loaded.

## Manual
Just create textarea.
```html
<textarea id="article"></textarea>
```

Write code as below.
```javascript
 $("#article").linedtextarea({
   width:'100%', 
   height:"350px",
   selectedLine: 10,
 });
```

## options
TODO

## Screenshot
![basic-usage](images/basic-usage.gif)

automatically `focus` line and apply `color` red.
![selectedLine](./images/selectedLine.png)


