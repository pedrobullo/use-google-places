# React Hook useGooglePlaces

Hook to consume Google Places API returning both autocomplete with debounce and geocoding callback method

### Installaition

- TODO

### Options

| Prop         | Description                                                                                               | Default |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------- |
| **`apiKey`** | Client-side google api key (documentation)[https://developers.google.com/places/web-service/get-api-key]. | _None_  |
| **`delay`**  | debounce OnChange (milliseconds).                                                                         | `0`     |

### Methods

| Prop           | Description                                                                                                                      | Type                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **`loading`**  | Triggers each request.                                                                                                           | `boolean`                                         |
| **`results`**  | Normalized Google API (predictions)[https://developers.google.com/places/web-service/autocomplete#place_autocomplete_responses]. | `{title, subtitle, placeId, description}`         |
| **`onChange`** | Function that triggers autocomplete.                                                                                             | `function<string>`                                |
| **`onSelect`** | Optional function that triggers geocoding executing a callback with coordinates and details.                                     | `function<{placeId}, callback<geocoding-payload>` |

### Usage

#### Component

```js
  const { loading, results, onChange, onSelect } = useGooglePlaces({
    apiKey: 'my-google-api-key',
    delay: 400,
  });

  ...

  const onPress = item => {
    onSelect(item, ({ coordinates }) => {
      dispatch({
        type: SET_LOCATION,
        payload: coordinates,
      });
    });
  };

  ...

  <FlatList
    data={results}
    renderItem={({ item }) => (
      <LocationItem
        title={item.title}
        subtitle={item.subtitle}
        onPress={onPress}
      />
    )}
  />
```
