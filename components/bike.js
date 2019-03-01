const Bike = props => (
  <div>
    {props.id ? (
      <div>
        <h2>Bike {props.id}</h2>
        <h3>
          Last seen {props.floating ? 'floating' : `at ${props.place}`} in{' '}
          {props.city}
        </h3>
        <img
          src={`https://brave-silk.glitch.me/mapbox/styles/v1/mapbox/streets-v11/static/pin-l+084A97(${
            props.long
          },${props.lat})/${props.long},${props.lat},14,0,0/300x300`}
        />
      </div>
    ) : (
      <h2>Bike doesn't exist</h2>
    )}
  </div>
);
export default Bike;
