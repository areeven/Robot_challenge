import { Robot } from "./Robot";
import { EnumeratedDirection } from "../utils/interfaces/EnumeratedDirection";
import { Board } from "./Board";

export class Move {
  private robot: Robot;
  private direction: EnumeratedDirection;
  private board: Board;
  private currentCommand: string = "";
  private currentShape: string = "";

  constructor(
    commands: string[],
    x_pos: number,
    y_pos: number,
    initDirection: EnumeratedDirection,
    board: Board
  ) {
    // Passing x_pos and y_pos directly to the Robot constructor
    this.robot = new Robot(x_pos, y_pos, initDirection);
    this.direction = initDirection;
    this.board = board; // Set the board instance passed to the constructor
    this.executeCommands(commands);
  }

  public executeCommands(commands: string[]) {
    for (const command of commands) {
      this.currentCommand = command;
      if (!["f", "b", "l", "r"].includes(command)) {
        throw new Error(`Command ${command} is not valid`);
      }
      if (command === "f") {
        this.forward();
      } else if (command === "b") {
        this.back();
      } else if (command === "l") {
        this.left();
      } else if (command === "r") {
        this.right();
      }
    }
    return commands;
  }

  public executeShape(shapes: string[]) {
    for (const shape of shapes) {
      this.currentShape = shape;
      console.log(`Shape: ${shape}`);
      if (!["flat", "globe"].includes(shape)) {
        throw new Error(`Shape ${shape} is not valid`);
      }
      // Add code here to execute the shape
    }
    return shapes;
  }

  private checkBoundaries() {
    const currentPosition = this.getRobot().getCurrentPosition();
    const width = this.board.getWidth();
    const height = this.board.getHeight();
    const obstaclePosition = this.board.getObstacle();

    if (this.currentShape === "flat") {
      if (
        currentPosition.x < 0 ||
        currentPosition.x >= width ||
        currentPosition.y < 0 ||
        currentPosition.y >= height
      ) {
        return false;
      } else {
        return true;
      }
    } else if (this.currentShape === "globe") {
      // Assuming globe shape allows wrapping around both width and height
      if (currentPosition.x < 0) {
        currentPosition.x += width;
      } else if (currentPosition.x >= width) {
        currentPosition.x -= width;
      }

      if (currentPosition.y < 0) {
        currentPosition.y += height;
      } else if (currentPosition.y >= height) {
        currentPosition.y -= height;
      }

      return {
        x: currentPosition.x,
        y: currentPosition.y,
      };
    }
  }

  private robotPosition() {
    const robotPos = this.robot.getCurrentPosition();
    console.log(
      `Current Position of robot: x: ${robotPos.x}, y: ${
        robotPos.y
      }, Command executed: ${this.getCurrentCommand()}, Direction: ${
        this.direction
      }`
    );
  }

  forward() {
    const robot = this.robot.getCurrentPosition();
    const obstacle = this.board.getObstacle();
    this.checkBoundaries();

    if (!obstacle || robot.x !== obstacle.x || robot.y !== obstacle.y - 1) {
      if (this.direction === EnumeratedDirection.north && robot.y > 0) {
        this.robot.moveUp(1);
      } else if (
        this.direction === EnumeratedDirection.east &&
        robot.x < this.board.getWidth()
      ) {
        this.robot.moveRight(1);
      } else if (
        this.direction === EnumeratedDirection.south &&
        robot.y < this.board.getHeight()
      ) {
        this.robot.moveDown(1);
      } else if (this.direction === EnumeratedDirection.west && robot.x > 0) {
        this.robot.moveLeft(1);
      }
      this.robotPosition();
    }
  }

  back() {
    const robot = this.robot.getCurrentPosition();
    const obstacle = this.board.getObstacle();
    this.checkBoundaries();
    if (!obstacle || robot.x !== obstacle.x || robot.y !== obstacle.y + 1) {
      if (
        this.direction === EnumeratedDirection.north &&
        this.robot.getCurrentPosition().y < this.board.getHeight() - 1
      ) {
        this.robot.moveDown(1);
        this.robotPosition();
      } else if (
        this.direction === EnumeratedDirection.east &&
        this.robot.getCurrentPosition().x > 0
      ) {
        this.robot.moveLeft(1);
        this.robotPosition();
      } else if (
        this.direction === EnumeratedDirection.south &&
        this.robot.getCurrentPosition().y > 0
      ) {
        this.robot.moveUp(1);
        this.robotPosition();
      } else if (
        this.direction === EnumeratedDirection.west &&
        this.robot.getCurrentPosition().x < this.board.getWidth() - 1
      ) {
        this.robot.moveRight(1);
        this.robotPosition();
      }
    }
  }

  left() {
    if (this.direction === EnumeratedDirection.north) {
      this.direction = EnumeratedDirection.west;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.east) {
      this.direction = EnumeratedDirection.north;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.south) {
      this.direction = EnumeratedDirection.east;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.west) {
      this.direction = EnumeratedDirection.south;
      this.robotPosition();
    }
  }

  right() {
    if (this.direction === EnumeratedDirection.north) {
      this.direction = EnumeratedDirection.east;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.east) {
      this.direction = EnumeratedDirection.south;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.south) {
      this.direction = EnumeratedDirection.west;
      this.robotPosition();
    } else if (this.direction === EnumeratedDirection.west) {
      this.direction = EnumeratedDirection.north;
      this.robotPosition();
    }
  }

  getRobot() {
    return this.robot;
  }

  getDirection() {
    return this.direction;
  }

  getCurrentCommand() {
    return this.currentCommand;
  }
}
