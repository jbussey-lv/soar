name: <string>,
color: <hex or color name>,
displacement: <vector>,
velocity: <vector>,
orientation: <angle>,
angular_velocity: <angle>,
center_of_gravity: <vector>,
mass: <int>,
moment_of_inertia: <int>,
sprite: <img or svg reference>
forces: [
    {
        name: <string ex weight>,
        color: <hex or color name>,
        location: <vector>,
        value: <function returning vector>
    },{
        name: <string ex weight>,
        color: <hex or color name>,
        location: <vector>,
        value: <function returning vector>
    }],
>
