const ShikakuData = [
    {
        // top
        slug: "top",
        camera: {
            pos: [ 0, 0, 2000 ],
            up: [ 0, 1, 0 ]
        },
        face: {
            pos: [ 0, 0, 500 ],
            rotate: [ 0, 0, 0 ]
        }
    },
    {
        // rear
        slug: "artist",
        camera: {
            pos: [ 0, 0, -2000 ],
            up: [ 0, 1, 0 ]
        },
        face: {
            pos: [ 0, 0, -500 ],
            rotate: [ 0, Math.PI, 0 ]
        }
    },
    {
        // left
        slug: "concept",
        camera: {
            pos: [ -2000, 0, 0 ],
            up: [ 0, 1, 0 ]
        },
        face: {
            pos: [ 500, 0, 0 ],
            rotate: [ 0, 1.5707, 0 ]
        }
    },
    {
        // right
        slug: "info",
        camera: {
            pos: [ 2000, 0, 0 ],
            up: [ 0, 1, 0 ]
        },
        face: {
            pos: [ -500, 0, 0 ],
            rotate: [ 0, -1.5707, 0 ]
        }
    },
    {
        // bottom
        slug: "etc",
        camera: {
            pos: [ 0, -2000, 0 ],
            up: [ 0, 0, 1 ]
        },
        face: {
            pos: [ 0, -500, 0 ],
            rotate: [ 1.5707, 0, 0 ]
        }
    },
    {
        // top
        slug: "special",
        camera: {
            pos: [ 0, 2000, 0 ],
            up: [ 0, 0, -1 ]
        },
        face: {
            pos: [ 0, 500, 0 ],
            rotate: [ -1.5707, 0, 0 ]
        }
    }
];

export default ShikakuData;
