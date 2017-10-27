CREATE TABLE IF NOT EXISTS `computer` (
  `idProduct` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `type` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `status` float NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `date` varchar(45) NOT NULL,
  `marca` varchar(45) NOT NULL,
  `picture` varchar(200) NOT NULL,
  `description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  
  PRIMARY KEY (`idProduct`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `computer` (`idProduct`, `name`, `type`, `price`, `status`, `latitude`, `longitude`, `date`, `marca`, `picture`, `description`, `location`) VALUES
( 1, 'GeForce GTX 1060 G1', 'Targueta grafica', '325€', '100%', '38.8294939', '-0.6182766,13', '12/12/2016', 'Gigabyte', 'https://img.pccomponentes.com/articles/10/102344/gigabyte-geforce-gtx-1060-g1-gaming-6gb-gddr5.jpg', 'Core
Clock   Boost: 1847 MHz/ Base: 1620 MHz in OC Mode
Boost: 1809 MHz/ Base: 1594 MHz in Gaming Mode
Memory Clock    8008 MHz
Graphics Processing GeForce GTX 1060
Process Technology  16 nm
Memory Size 6 GB
Memory Bus 192 bit
Card Bus    PCI-E 3.0 x 16
Memory Type GDDR5
DirectX 12
OpenGL  4.5
PCB Form    ATX
Digital max resolution  7680x4320 (requires 2*DP1.3 connectors)
Analog max resolution   4096x2160
Multi-view  4
Output  Dual-link DVI-D *1
HDMI-2.0b*1 (Max Resolution: 4096x2160 @60 Hz)
Display Port-1.4 *3 (Max Resolution: 7680x4320 @60 Hz)
Card size   H=40 L=278 W=114 mm', 'Ontinyent')


