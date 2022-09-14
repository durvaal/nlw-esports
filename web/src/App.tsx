interface TitleProps {
  value: string;
  backgroundColor: string;
};

function Title(props: TitleProps) {
  return <h1 style={{backgroundColor: props.backgroundColor}}>{props.value}</h1>
};

function App() {
  return (
    <>
      <Title value="Hello" backgroundColor="green" />
      <Title value="World" backgroundColor="purple" />
    </>
  );
};

export default App;
