import { createSignal, useEffect, useMemo } from "@idealjs/corn";

const Hello = (props: { name: string }) => {
  const { name } = props;

  const [state, setState] = createSignal(true);

  const [todos, setTodos] = createSignal<boolean[]>([true, false]);

  const todosDiv = useMemo(() => {
    return todos().map((todo, index) => {
      return <div key={index}>memo test {todo}</div>;
    });
  });

  const onClick = () => {
    // console.log("test test");
    setState((s) => !s);
    setTodos((todos) => [...todos, state()]);
  };

  useEffect(() => {
    console.log("Hello", name, state());
  });

  useEffect(() => {
    console.log("Hello", name, todos());
  });

  return (
    <div>
      <div>Hello {name}</div>
      <div>
        <div>
          {123}
          {321}
        </div>
        <button onClick={onClick}>
          {"test"} {"button"}
        </button>
        {todos().map((todo) => {
          return <div>test {todo}</div>;
        })}
        {todosDiv}
      </div>
      <div>state {state}</div>
    </div>
  );
};

export default Hello;
