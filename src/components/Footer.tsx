
function Footer() {
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content">
      <div className="items-center grid-flow-col">
        <p>Made by Guillaume Gomez - 2023</p>
      </div> 
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <button className="btn btn-accent">Github</button>
      </div>
    </footer>
  )
}

export default Footer;
