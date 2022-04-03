# Create an API endpoint for adding data.

To create an API endpoint to send new data to the server you should use an http `POST`.

For an `POST` method to work correctly in ExpressJS you need to configure some middleware.

Using this code:

```js
// enable the req.body object - to allow us to use HTML forms
// when doing post requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

This will ensure that the `req.body` property contains the form data that's sent to the server when doing a `POST` route.

