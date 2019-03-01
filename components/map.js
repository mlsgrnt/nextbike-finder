const Map = props => (
  <img
    src={`https://brave-silk.glitch.me/mapbox/styles/v1/mapbox/streets-v11/static/pin-l+084A97(${
      props.long
    },${props.lat})/${props.long},${props.lat},14,0,0/300x300`}
  />
);
export default Map;
