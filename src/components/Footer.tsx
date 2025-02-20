interface FooterProps {
}

function Footer({  }: FooterProps) {
  return (
    <footer className="flex flex-row items-center p-4">
      <div className="flex items-center">
        <span>Made by Guillaume Gomez - (2024 - {new Date().getFullYear()})</span>
      </div> 
    </footer>
  )
}

export default Footer;
