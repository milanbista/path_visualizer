const canvas = document.querySelector('canvas')
canvas.height = 600
canvas.width = 600
canvas.style.border='1px solid black'
const c = canvas.getContext('2d')

const row= 30
const col = 30
var boxes =[]
var open_list = []
var closed_list = new Set()
var counter = 0

class Box {
    constructor(x_position,y_position) {
        this.x_position = x_position
        this.y_position = y_position
        this.neighbors = []
        this.isStart = false
        this.isEnd = false
        this.parent = null         
    }
}

function create_grid(){

    for (let i = 0; i< row; i++){
        boxes[i] = []
        for(let j =0; j< col; j++){
            boxes[i][j] = new Box(i*canvas.height/row, j*canvas.width/col)
            c.beginPath()
            c.rect(i*canvas.height/row, j*canvas.width/col, 20,20)
            c.strokeStyle ="rgb(174,177,181)"
            c.stroke()

        }
    }
}


function get_neighbors(){
    for (let i = 0; i< row; i++){
        for(let j =0; j< col; j++){

            //check up
            if(i > 0){
                boxes[i][j].neighbors.push(boxes[i-1][j])
            }

            //check bottom
            if(i < (row-1)){
                boxes[i][j].neighbors.push(boxes[i+1][j])
            }

            //check right

            if(j < (col-1)){
                boxes[i][j].neighbors.push(boxes[i][j+1])

            }
            //check left
            if(j > 0){
                boxes[i][j].neighbors.push(boxes[i][j-1])
            }

        }
    }

}


  start_animation = ()=>{

    var interval = setInterval( async() => {
        if(open_list.length > 0){
            let item = open_list[0]
            closed_list.add(item)
            const a = await open_list.shift()
            color_box(item)
            check_each_neighbors(item)
             
            if(item == end_node){
                console.log("Yeahhh ")
                const x = await draw_path(end_node)
                clearInterval(interval)
            } 
            
        }

        
    }, 1);
    
    
}


function draw_path(current_node){
    if(current_node == start_node){
        return
    }
    start_end_node_color(current_node, 'yellow')
    draw_path(current_node.parent)

}





function check_each_neighbors(obj){

    // console.log("right now neighbor length is", obj.neighbors.length)
    for(let i =0; i< obj.neighbors.length; i++){

        if(!closed_list.has(obj.neighbors[i])){
            
            var is_already_in_open = false
            for( let k =0; k< open_list.length; k++){
                if(open_list[k] == obj.neighbors[i]){
                    is_already_in_open = true
                }
            }

            if(!is_already_in_open){
                obj.neighbors[i].parent = obj
                open_list.push(obj.neighbors[i])
                

            }
        }
        

    }
}


function color_box(item){

    if(item.isStart == false && item.isEnd == false){
    c.beginPath()
    c.rect(item.x_position, item.y_position, 20,20)
    c.fillStyle='rgb(77,242,242)'
    c.fill()
    c.stroke()  
    }
}

function start_end_node_color(item, color){
    c.beginPath()
    c.rect(item.x_position, item.y_position, 20,20)
    c.fillStyle=color
    c.fill()
    c.stroke() 
}

create_grid()
get_neighbors()

const start_node = boxes[3][15]
const end_node = boxes[25][25]
start_node.isStart = true
end_node.isEnd = true

start_end_node_color(start_node, 'red')

start_end_node_color(end_node, 'blue')

open_list[0] = start_node

start_animation()











