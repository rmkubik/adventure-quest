import ReactDOM from "react-dom";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Inventory = styled.div`
  background-color: gray;
  padding: 1em;
  border-radius: 4px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Equipped = styled.div`
  background-color: navy;
  padding: 1em;
  border-radius: 4px;
`;

const Item = styled.div`
  background-color: lightgray;
  padding: 1em;
  margin: 1em;
  border-radius: 4px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const setIndex = (array, index, value) => {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
};

const insertIndex = (array, index, value) => {
  return [...array.slice(0, index), value, ...array.slice(index)];
};

const removeIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const clone = (array) => JSON.parse(JSON.stringify(array));

const App = () => {
  const [inventory, setInventory] = useState([
    { id: "1", content: "first" },
    { id: "2", content: "second" },
  ]);
  const [equipped, setEquipped] = useState([{ id: "3", content: "third" }]);

  return (
    <DragDropContext
      onDragEnd={(result) => {
        console.log(result);
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        let source;
        let newInventory = clone(inventory);
        let newEquipped = clone(equipped);

        if (result.source.droppableId === "inventory") {
          // remove from inventory
          source = inventory[result.source.index];
          newInventory = removeIndex(newInventory, result.source.index);
        }

        if (result.source.droppableId === "equipped") {
          // remove from equipped
          source = equipped[result.source.index];
          newEquipped = removeIndex(newEquipped, result.source.index);
        }

        if (result.destination.droppableId === "inventory") {
          // add to inventory
          newInventory = insertIndex(
            newInventory,
            result.destination.index,
            source
          );
        }

        if (result.destination.droppableId === "equipped") {
          // add to equipped
          newEquipped = insertIndex(
            newEquipped,
            result.destination.index,
            source
          );
        }

        setInventory(newInventory);
        setEquipped(newEquipped);
      }}
    >
      <Layout>
        <Droppable droppableId="equipped">
          {(provided, snapshot) => (
            <Equipped {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Equipped</h2>
              {equipped.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Equipped>
          )}
        </Droppable>
        <Droppable droppableId="inventory">
          {(provided, snapshot) => (
            <Inventory {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Inventory</h2>
              {inventory.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Inventory>
          )}
        </Droppable>
      </Layout>
    </DragDropContext>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
