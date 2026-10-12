/* Mod Rush — code partagé entre le panneau de contrôle (index.html) et l'overlay OBS (overlay.html).
   Les deux pages doivent être sur le même domaine (ton site Vercel) et ouvertes dans OBS
   (dock personnalisé + source navigateur) pour partager le même stockage. */
const SAMPLE = `# Iron Chests
Copper Chest
Iron Chest
Gold Chest
Diamond Chest
Crystal Chest
Obsidian Chest
Dirt Chest
Netherite Chest
Wood to Copper Chest Upgrade
Copper to Iron Chest Upgrade
Iron to Gold Chest Upgrade
Gold to Diamond Chest Upgrade
Diamond to Crystal Chest Upgrade
Diamond to Obsidian Chest Upgrade
Obsidian to Netherite Chest Upgrade

# Waystones
Waystone
Mossy Waystone
Sandy Waystone
Sharestone
Warp Plate
Portstone
Warp Stone
Warp Scroll
Return Scroll
Bound Scroll
Attuned Shard
Warp Dust

# Farmer's Delight
Stove
Cooking Pot
Skillet
Cutting Board
Basket
Flint Knife
Iron Knife
Golden Knife
Diamond Knife
Netherite Knife
Rope
Safety Net
Tomato
Cabbage
Onion
Rice
Straw
Canvas
Organic Compost
Rich Soil
Tomato Sauce
Mixed Salad
Beef Stew
Fried Rice
Pumpkin Soup

# Sophisticated Backpacks
Backpack
Copper Backpack
Iron Backpack
Gold Backpack
Diamond Backpack
Netherite Backpack
Pickup Upgrade
Filter Upgrade
Magnet Upgrade
Feeding Upgrade
Compacting Upgrade
Void Upgrade
Restock Upgrade
Deposit Upgrade
Crafting Upgrade
Stack Upgrade Tier 1
Upgrade Base

# Supplementaries
Sack
Jar
Safe
Globe
Pedestal
Clock Block
Hourglass
Rope
Bellows
Turn Table
Notice Board
Speaker Block
Wind Vane
Slingshot
Bubble Blower
Flute
Cage
Cannon

# Create
Andesite Alloy
Shaft
Cogwheel
Large Cogwheel
Gearbox
Water Wheel
Windmill Bearing
Mechanical Bearing
Sail
Andesite Casing
Brass Casing
Copper Casing
Brass Ingot
Precision Mechanism
Wrench
Engineer's Goggles
Belt Connector
Millstone
Crushing Wheel
Mechanical Press
Mechanical Mixer
Basin
Blaze Burner
Encased Fan
Mechanical Drill
Mechanical Saw
Deployer
Mechanical Crafter
Depot
Chute
Andesite Funnel
Fluid Pipe
Mechanical Pump
Fluid Tank
Spout
Item Drain
Super Glue
Linear Chassis

# Mekanism
Osmium Ingot
Steel Ingot
Steel Casing
Basic Control Circuit
Metallurgic Infuser
Enrichment Chamber
Crusher
Purification Chamber
Chemical Injection Chamber
Electrolytic Separator
Heat Generator
Solar Generator
Basic Energy Cube
Basic Universal Cable
Basic Logistical Transporter
Energy Tablet
Configurator
Atomic Disassembler
Digital Miner
Personal Chest
Cardboard Box
Jetpack
Teleporter
Portable Teleporter

# Botania
Lexica Botania
Wand of the Forest
Petal Apothecary
Pure Daisy
Livingrock
Livingwood
Endoflame
Hydroangeas
Mana Spreader
Mana Pool
Mana Tablet
Manasteel Ingot
Mana Pearl
Mana Diamond
Runic Altar
Rune of Water
Rune of Fire
Rune of Earth
Rune of Air
Terrestrial Agglomeration Plate
Terrasteel Ingot
Elementium Ingot
Terra Blade

# Tinkers' Construct
Grout
Seared Brick
Smeltery Controller
Seared Heater
Seared Faucet
Casting Table
Casting Basin
Crafting Station
Part Builder
Tinker Station
Part Chest
Slimesteel Ingot
Rose Gold Ingot
Cobalt Ingot
Manyullyn Ingot
Pickaxe
Sledge Hammer
Mattock
Broad Axe
Sword
Cleaver

# Twilight Forest
Magic Map
Maze Map
Ore Magnet
Raven Feather
Naga Scale
Naga Trophy
Lich Trophy
Charm of Life
Charm of Keeping
Ironwood Ingot
Steeleaf Ingot
Fiery Ingot
Knightmetal Ingot
Carminite
Uncrafting Table
Peacock Feather Fan
Ender Bow
Ice Bow
Giant Pickaxe

# Applied Energistics 2
Certus Quartz Crystal
Fluix Crystal
Charger
Inscriber
Logic Processor
Calculation Processor
Engineering Processor
ME Controller
Energy Acceptor
ME Glass Cable
Quartz Fiber
ME Drive
1k ME Storage Cell
ME Terminal
ME Crafting Terminal
ME Interface
Import Bus
Export Bus
Storage Bus
Molecular Assembler
Pattern Provider
Crafting Unit
Wireless Terminal

# Refined Storage
Quartz Enriched Iron
Silicon
Basic Processor
Improved Processor
Advanced Processor
Controller
Cable
Grid
Crafting Grid
Pattern Grid
Disk Drive
1k Storage Disk
4k Storage Disk
16k Storage Disk
64k Storage Disk
Importer
Exporter
External Storage
Crafter
Pattern
Wireless Grid
Wireless Transmitter
Network Card

# Ars Nouveau
Worn Notebook
Novice Spell Book
Apprentice Spell Book
Archmage Spell Book
Scribe's Table
Source Gem
Sourcestone
Archwood Log
Source Berry
Magebloom
Imbuement Chamber
Enchanting Apparatus
Arcane Core
Arcane Pedestal
Source Jar
Dominion Wand
Starbuncle Charm
Wixie Charm
Drygmy Charm

# Immersive Engineering
Engineer's Hammer
Coke Brick
Coke Oven
Blast Brick
Steel Ingot
Treated Wood Planks
Engineer's Workbench
Wire Cutters
LV Wire Coil
LV Wire Connector
Kinetic Dynamo
Water Wheel
Windmill
Engineer's Manual
Conveyor Belt
Revolver

# Storage Drawers
Oak Drawer
Oak Drawers 1x2
Oak Drawers 2x2
Compacting Drawer
Drawer Controller
Controller Slave
Upgrade Template
Storage Upgrade (I)
Void Upgrade
Drawer Key
Quantify Key
Shroud Key
Oak Trim

# Alex's Mobs
Animal Dictionary
Crocodile Scute
Roadrunner Feather
Bear Fur
Banana
Fish Oil
Mosquito Proboscis
Bone Serpent Tooth
Lava Bottle
Kangaroo Meat
Moose Antler
Tarantula Hawk Wing
Rattlesnake Rattle
Gongylidia
Shark Tooth
Blood Sac
Rainbow Jelly
Dropbear Claw

# Quark
Pickarang
Flamerang
Echorang
Seed Pouch
Trowel
Abacus
Pathfinder's Quill
Ancient Tome
Slime in a Bucket
Rope
Grate
Crate
Iron Rod
Ender Watcher
Feeding Trough
Magnet
Gravisand
Forgotten Hat
Ravager Hide
Glass Item Frame

# Biomes O' Plenty
Rose Quartz Chunk
Fir Log
Redwood Log
Mahogany Log
Jacaranda Log
Palm Log
Willow Log
Dead Log
Magic Log
Umbran Log
Hellbark Log
Empyreal Log
White Sand
Orange Sand
Black Sand
Flesh
Brimstone
Toadstool
Glowshroom
Lavender
Wildflower
Burning Blossom

# The Aether
Skyroot Log
Holystone
Ambrosium Shard
Zanite Gemstone
Enchanted Gravitite
Skyroot Bucket
Golden Parachute
Cold Parachute
Altar
Freezer
Incubator
Zanite Pickaxe
Gravitite Pickaxe
Moa Egg
Aechor Petal
Gummy Swet
Bronze Dungeon Key
Silver Dungeon Key
Gold Dungeon Key
Valkyrie Lance

# Thermal Expansion
Machine Frame
Redstone Furnace
Pulverizer
Sawmill
Induction Smelter
Phytogenic Insolator
Centrifugal Separator
Multiservo Press
Magma Crucible
Fluid Encapsulator
Fractionating Still
Alchemical Imbuer
Energetic Infuser
Stirling Dynamo
Compression Dynamo
Magmatic Dynamo

# Thermal Foundation
Tin Ingot
Lead Ingot
Silver Ingot
Nickel Ingot
Bronze Ingot
Electrum Ingot
Invar Ingot
Constantan Ingot
Signalum Ingot
Lumium Ingot
Enderium Ingot
Crescent Hammer
Redstone Servo
Flux Capacitor
Flux Drill
Flux Saw
Rich Slag
Blizz Rod
Basalz Rod
Blitz Rod
Earth Charge
Ice Charge
Lightning Charge

# Industrial Foregoing
Machine Frame (Pity)
Machine Frame (Simple)
Machine Frame (Advanced)
Machine Frame (Supreme)
Plastic
Dryrubber
Latex Processing Unit
Fluid Extractor
Dissolution Chamber
Mob Crusher
Animal Rancher
Plant Gatherer
Plant Sower
Ore Laser Base
Laser Drill
Infinity Drill
Meat Feeder
Conveyor

# Iron's Spells 'n Spellbooks
Copper Spell Book
Iron Spell Book
Gold Spell Book
Diamond Spell Book
Netherite Spell Book
Inscription Table
Scroll Forge
Arcane Anvil
Arcane Essence
Blank Upgrade Orb
Fire Upgrade Orb
Ice Upgrade Orb
Mana Upgrade Orb
Arcane Debris
Mithril Scrap
Mithril Ingot
Blood Staff
Wayward Compass

# Ice and Fire
Bestiary
Dragon Bone
Dragon Skull
Fire Dragon Blood
Ice Dragon Blood
Dragonsteel Fire Ingot
Dragonsteel Ice Ingot
Silver Ingot
Sapphire Gem
Dragon Horn
Dragon Flute
Hippogryph Egg
Cockatrice Eye
Pixie Dust
Myrmex Resin
Sea Serpent Scales

# Mowzie's Mobs
Wrought Helm
Axe of a Thousand Metals
Sol Visage
Ice Crystal
Earthrend Gauntlet
Spear
Blowgun
Dart
Naga Fang
Foliaath Seed
Glowing Jelly
Captured Grottol

# Alex's Caves
Cave Map
Cave Tablet
Scarlet Neodymium Ingot
Azure Neodymium Ingot
Galena Gauntlet
Uranium Shard
Uranium Rod
Nuclear Bomb
Raygun
Tectonic Shard
Amber
Sea Glass Shards

# Macaw's Doors
Oak Barn Door
Oak Stable Door
Oak Glass Door
Oak Japanese Door
Oak Modern Door
Oak Beach Door
Oak Cottage Door
Oak Paper Door
Oak Classic Door
Oak Swamp Door

# Building Gadgets
Building Gadget
Exchanging Gadget
Copy-Paste Gadget
Destruction Gadget
Template Manager
Template
Charging Station

# Mining Gadgets
Mining Gadget (Simple)
Mining Gadget (Fancy)
Mining Gadget (Ultimate)
Modification Table
Upgrade Empty
Silk Touch Upgrade
Fortune Upgrade
Range Upgrade
Magnet Upgrade
Void Junk Upgrade
Battery Upgrade
Efficiency Upgrade
Light Placer Upgrade
Freezing Upgrade

# Torchmaster
Megatorch
Dreadlamp
Feral Flare Lantern
Frozen Pearl

# Comforts
White Sleeping Bag
Red Sleeping Bag
White Hammock
Blue Hammock
Rope and Nail

# Traveler's Backpack
Standard Traveler's Backpack
Iron Traveler's Backpack
Gold Traveler's Backpack
Diamond Traveler's Backpack
Netherite Traveler's Backpack
Hose
Hose Nozzle
Backpack Tank
Blank Upgrade
Iron Tier Upgrade
Crafting Upgrade
Feeding Upgrade

# Corail Tombstone
Grave Dust
Decorative Grave
Ankh of Prayer
Voodoo Poppet
Book of Disenchantment
Familiar Receptacle
Scroll of Knowledge
Lost Tablet
Soul Receptacle
Grave's Key

# Cooking for Blockheads
Recipe Book
Crafting Book
Cooking Table
Fridge
Sink
Oven
Counter
Corner
Spice Rack
Tool Rack
Milk Jar
Cow in a Jar
Fruit Basket
Cutting Board
Kitchen Floor
Toaster

# Silent Gear
Blueprint Paper
Template Board
Crimson Iron Ingot
Azure Silver Ingot
Crimson Steel Ingot
Azure Electrum Ingot
Tyrian Steel Ingot
Blaze Gold Ingot
Salvager
Metal Alloyer
Material Grader
Pickaxe Head
Rod
Binding
Grip

# Productive Bees
Advanced Oak Beehive
Expansion Box
Centrifuge
Powered Centrifuge
Bottler
Honey Generator
Catcher
Incubator
Feeder
Bee Cage
Sturdy Bee Cage
Honey Treat
Upgrade Base
Productivity Upgrade

# Mystical Agriculture
Inferium Essence
Prudentium Essence
Tertium Essence
Imperium Essence
Supremium Essence
Prosperity Shard
Inferium Seeds
Iron Seeds
Diamond Seeds
Infusion Crystal
Infusion Altar
Infusion Pedestal
Soul Jar
Soulium Dagger
Watering Can
Inferium Farmland

# Powah
Uraninite
Energizing Orb
Energizing Rod
Dielectric Paste
Capacitor (Basic)
Energy Cell (Basic)
Furnator (Basic)
Magmator (Basic)
Solar Panel (Basic)
Thermo Generator (Basic)
Reactor (Basic)
Player Transmitter
Energy Discharger
Ender Cell
Wrench

# Extreme Reactors
Yellorium Ingot
Cyanite Ingot
Blutonium Ingot
Graphite Bar
Reactor Casing
Reactor Controller
Reactor Fuel Rod
Reactor Control Rod
Reactor Glass
Reactor Power Tap
Turbine Casing
Turbine Controller
Turbine Rotor Shaft
Turbine Rotor Blade

# Draconic Evolution
Draconium Dust
Draconium Ingot
Draconium Core
Wyvern Core
Awakened Draconium Ingot
Dragon Heart
Chaos Shard
Fusion Crafting Core
Crafting Injector
Energy Core
Energy Pylon
Wyvern Pickaxe
Draconic Staff of Power
Grinder
Dislocator

# Ender IO
Conduit Binder
Electrical Steel Ingot
Energetic Alloy Ingot
Vibrant Alloy Ingot
Pulsating Iron Ingot
Dark Steel Ingot
Soularium Ingot
Alloy Smelter
SAG Mill
Stirling Generator
Energy Conduit
Item Conduit
Fluid Conduit
Yeta Wrench
Basic Capacitor
Capacitor Bank
Soul Binder
Dark Steel Pickaxe

# Pipez
Item Pipe
Fluid Pipe
Energy Pipe
Gas Pipe
Universal Pipe
Basic Upgrade
Improved Upgrade
Advanced Upgrade
Ultimate Upgrade
Filter Destination Tool
Wrench

# Mekanism Generators
Heat Generator
Solar Generator
Advanced Solar Generator
Gas-Burning Generator
Bio-Generator
Wind Generator
Turbine Casing
Turbine Rotor
Turbine Blade
Rotational Complex
Electromagnetic Coil
Saturating Condenser
Fission Reactor Casing
Fission Fuel Assembly
Fusion Reactor Controller
Hohlraum

# Mekanism Tools
Wooden Paxel
Diamond Paxel
Osmium Pickaxe
Bronze Pickaxe
Steel Pickaxe
Lapis Lazuli Pickaxe
Refined Glowstone Pickaxe
Refined Obsidian Pickaxe
Osmium Paxel
Steel Paxel
Refined Obsidian Paxel
Steel Sword
Steel Shield
Osmium Helmet
Refined Obsidian Chestplate

# Blood Magic
Sacrificial Knife
Blood Altar
Weak Blood Orb
Apprentice Blood Orb
Magician's Blood Orb
Blank Slate
Reinforced Slate
Imbued Slate
Blank Rune
Speed Rune
Rune of Sacrifice
Divination Sigil
Water Sigil
Lava Sigil
Air Sigil
Soul Snare
Petty Tartaric Gem
Hellfire Forge
Alchemy Table
Ritual Stone
Master Ritual Stone

# Occultism
Dictionary of Spirits
Datura Seeds
Otherworld Goggles
Chalk (White)
Chalk (Golden)
Chalk (Purple)
Chalk (Red)
Sacrificial Bowl
Golden Sacrificial Bowl
Spirit Attuned Gem
Iesnium Ingot
Divination Rod
Soul Gem
Butcher Knife
Infused Pickaxe
Storage Controller
Dimensional Matrix
Familiar Ring

# Apotheosis
Gem Cutting Table
Salvaging Table
Reforging Table
Simple Reforging Table
Augmenting Table
Gem Dust
Gem Fused Slate
Sigil of Socketing
Sigil of Withdrawal
Sigil of Enhancement
Hellshelf
Seashelf
Endshelf
Library of Alexandria
Ender Library
Potion Charm
Boss Summoner

# Artifacts
Night Vision Goggles
Snorkel
Villager Hat
Superstitious Hat
Cowboy Hat
Anglers Hat
Lucky Scarf
Scarf of Invisibility
Cross Necklace
Panic Necklace
Shock Pendant
Flame Pendant
Thorn Pendant
Charm of Sinking
Cloud in a Bottle
Obsidian Skull
Antidote Vessel
Universal Attractor
Crystal Heart
Helium Flamingo
Digging Claws
Feral Claws
Power Glove
Fire Gauntlet
Pocket Piston
Vampiric Glove
Golden Hook
Running Shoes
Aqua-Dashers
Bunny Hoppers
Kitty Slippers
Flippers
Rooted Boots
Steadfast Spikes
Everlasting Beef
Eternal Steak
Whoopee Cushion
Umbrella

# SecurityCraft
Keypad
Keypad Door
Keycard Reader
Level 1 Keycard
Password-protected Chest
Reinforced Oak Planks
Security Camera
Camera Monitor
Laser Block
Inventory Scanner
Retinal Scanner
Mine
Claymore
Sentry
Alarm
Portable Radar
Username Logger
Briefcase
Universal Block Remover
Universal Owner Changer

# MrCrayfish's Furniture Mod
Oak Table
Oak Chair
Oak Coffee Table
Oak Cabinet
Oak Bedside Cabinet
Oak Desk
Oak Blinds
Oak Upgraded Fence
Mail Box
Cooler
Grill
Trampoline
Lamp

# Decorative Blocks
Oak Beam
Oak Palisade
Oak Seat
Oak Support
Lattice
Brazier
Soul Brazier
Bonfire
Chandelier
Soul Chandelier
Rocky Dirt
Stone Pillar

# Dark Utilities
Vector Plate
Damage Plate
Maim Plate
Ender Hopper
Charm of Gluttony
Sleep Charm
Experience Charm
Portal Charm
Vector Charm

# Functional Storage
Oak Drawer (1)
Oak Drawer (2)
Oak Drawer (4)
Compacting Drawer
Simple Compacting Drawer
Fluid Drawer (1)
Ender Drawer
Storage Controller
Controller Extension
Armory Cabinet
Iron Downgrade
Copper Upgrade
Gold Upgrade
Diamond Upgrade
Netherite Upgrade
Collector Upgrade
Pusher Upgrade
Puller Upgrade
Void Upgrade
Linking Tool
Configuration Tool

# Simple Storage Network
Storage Network Master
Request Table
Crafting Request Table
Network Cable
Storage Link Cable
Import Cable
Export Cable
Network Inventory Remote
Wireless Crafting Remote
Collector Remote

# Integrated Dynamics
On the Dynamics of Integration
Menril Log
Crystalized Menril Chunk
Squeezer
Drying Basin
Mechanical Squeezer
Mechanical Drying Basin
Logic Cable
Variable Card
Logic Programmer
Variable Store
Inventory Reader
Display Panel
Energy Battery
Coal Generator
Labeller
Proto-Chorus
Wrench

# Modular Routers
Modular Router
Blank Module
Sender Module Mk1
Sender Module Mk2
Sender Module Mk3
Puller Module Mk1
Dropper Module
Placer Module
Breaker Module
Vacuum Module
Speed Upgrade
Stack Upgrade
Range Upgrade
Bulk Item Filter
Regex Filter
Inspection Filter
Template Frame

# XNet
Controller
Connector
Advanced Connector
Netcable (Red)
Advanced Netcable
Router
Wireless Router
Antenna
Redstone Information
Facade
Connector Upgrade

# RFTools
Machine Frame
Machine Base
Dimensional Shard
Smart Wrench
Coalgenerator
Crafter Tier 1
Storage Scanner
Screen
Screen Controller
Builder
Shape Card
Quarry Shape Card
Space Chamber
Space Chamber Card
Composer
Scanner

# Cyclic
Sleeping Mat
Storage Bag
Magic Net
Climbing Gloves
Heart Container
Experience Pylon
Harvester
Forester
Dark Glass
Lava Sponge
Ender Book

# Hostile Neural Networks
Deep Learner
Blank Data Model
Data Model
Prediction Matrix
Simulation Chamber
Loot Fabricator
Overworld Prediction
Nether Prediction
End Prediction

# PneumaticCraft
Compressed Iron Ingot
Air Compressor
Pressure Tube
Pressure Gauge
Pneumatic Wrench
Pressure Chamber Wall
Pressure Chamber Valve
Pressure Chamber Interface
Plastic
Empty PCB
Printed Circuit Board
Programmer
Drone
Programmable Controller
Refinery Controller
Thermopneumatic Processing Plant
Amadron Tablet
Pneumatic Helmet
Jackhammer
Minigun

# Ad Astra
Steel Ingot
Desh Ingot
Ostrum Ingot
Calorite Ingot
NASA Workbench
Fuel Refinery
Oxygen Loader
Oxygen Distributor
Launch Pad
Tier 1 Rocket
Tier 2 Rocket
Tier 3 Rocket
Tier 4 Rocket
Space Helmet
Space Suit
Netherite Space Suit
Jet Suit
Rover
Wrench
Cheese

# Forbidden & Arcanus
Arcane Crystal
Rune
Darkstone
Deorum Ingot
Stellarite Piece
Soul
Mundabitur Dust
Hephaestus Forge
Clibano Core
Utrem Jar
Edelwood Log
Edelwood Bucket
Mysterywood Log
Golden Orchid Seeds
Quantum Catcher
Eternal Stella
Lens of Veritatis
Obsidian Skull
Spectral Eye Amulet

# Malum
Encyclopedia Arcana
Crude Scythe
Runewood Log
Soulwood Log
Soulstone
Brilliance Cluster
Blazing Quartz
Arcane Spirit
Sacred Spirit
Earthen Spirit
Spirit Altar
Spirit Jar
Spirit Crucible
Spirit Catalyzer
Hallowed Gold Ingot
Soul Stained Steel Ingot
Soul Stained Steel Scythe
Ether Torch
Tyrving

# The Undergarden
Catalyst
Depthrock
Shiverstone
Smogstem Log
Wigglewood Log
Grongle Log
Cloggrum Ingot
Froststeel Ingot
Utherium Crystal
Regalium Crystal
Forgotten Ingot
Underbeans
Blisterberry
Ditchbulb
Gloomgourd
Cloggrum Sword
Slingshot
Masticated Chunk

# Blue Skies
Zeal Lighter
Turquoise Stone
Lunar Stone
Bluebright Log
Starlit Log
Frostbright Log
Lunar Log
Dusk Log
Maple Log
Pyrope Gem
Aquite
Diopside Gem
Charoite
Moonstone
Horizonite Ingot
Falsite Ingot
Ventium Shard
Blinding Key
Nature Key

# Deeper and Darker
Echo Log
Sculk Stone
Gloomslate
Ancient Vase
Soul Dust
Soul Crystal
Resonarium
Reinforced Echo Shard
Heart of the Deep
Sculk Transmitter
Sonorous Staff
Soul Elytra
Warden Helmet
Warden Pickaxe
Warden Sword

# The Bumblezone
Pile of Pollen
Honey Crystal
Honey Crystal Shards
Porous Honeycomb Block
Filled Porous Honeycomb Block
Sticky Honey Residue
Bee Bread
Royal Jelly Bottle
Honey Compass
Buzzing Briefcase
Crystal Cannon
Honey Crystal Shield
Stinger Spear
Bumble Bee Chestplate
Honey Bee Leggings
Essence of the Bees

# Aquaculture 2
Iron Fishing Rod
Gold Fishing Rod
Diamond Fishing Rod
Neptunium Fishing Rod
Neptunium Ingot
Neptune's Bounty
Tackle Box
Worm
Iron Hook
Gold Hook
Light Hook
Bobber
Fish Fillet
Fish Bones
Message in a Bottle
Atlantic Cod
Arapaima
Pacific Halibut
Jellyfish
Goldfish

# Upgrade Aquatic
Driftwood Log
River Log
Beachgrass
Coralstone
Prismarine Rod
Elder Eye
Jellyfish Torch
Thrasher Tooth
Pike
Lionfish
Perch

# Neapolitan
Strawberries
Vanilla Pods
Chocolate Bar
Banana
Banana Bunch
Dried Banana
Mint Leaves
Adzuki Beans
Ice Cubes
Milk Bottle
Strawberry Ice Cream
Vanilla Ice Cream
Chocolate Ice Cream
Banana Ice Cream
Neapolitan Ice Cream
Vanilla Cake

# Environmental
Willow Log
Wisteria Log
Pine Log
Cattails
Hibiscus
Bird of Paradise
Truffle
Duck Egg
Venison
Koi
Slabfish Bucket
Yak Hair

# Autumnity
Maple Log
Red Maple Leaves
Orange Maple Leaves
Yellow Maple Leaves
Foul Berries
Foul Soup
Sap Bottle
Syrup Bottle
Pancake
Snail Goo
Snail Shell Piece
Snail Shell Block
Turkey Egg

# Buzzier Bees
Honey Pot
Honey Wand
Bee Bottle
Honey Apple
Honey Bread
Glazed Porkchop
Crystallized Honey
Crystallized Honey Block
Honey Lamp
Buttercup
Pink Clover
White Clover

# Croptopia
Cooking Pot
Frying Pan
Food Press
Mortar and Pestle
Knife
Artichoke
Asparagus
Bellpepper
Blackbean
Blueberry
Broccoli
Coffee Beans
Corn
Cranberry
Cucumber
Eggplant
Garlic
Ginger
Grape
Kiwi
Lemon
Mango
Peanut
Pineapple
Strawberry
Tea Leaves
Vanilla

# Brewin' and Chewin'
Keg
Beer
Vodka
Mead
Rice Wine
Egg Grog
Strongroot Ale
Saccharine Rum
Pale Jane
Dread Nog
Flaxen Cheese Wheel
Scarlet Cheese Wheel
Pizza
Fiery Fondue
Kimchi
Jerky

# Create: Steam 'n' Rails
Conductor Cap
Conductor Whistle
Track Coupler
Andesite Track Switch
Brass Track Switch
Semaphore
Diesel Smokestack
Coalburner Stack
Oak Track
Monorail Track
Narrow Gauge Track
Wide Gauge Track
Phantom Track

# Create Crafts & Additions
Electric Motor
Alternator
Accumulator
Small Connector
Copper Spool
Copper Wire
Gold Wire
Copper Rod
Zinc Sheet
Rolling Mill
Tesla Coil
Portable Energy Interface
Liquid Blaze Burner
Diamond Grit
Diamond Grit Sandpaper
Straw
Bio Ethanol Bucket
Seed Oil Bucket
Cake Base
Chocolate Cake
Honey Cake

# Tom's Simple Storage
Storage Terminal
Crafting Terminal
Inventory Connector
Inventory Cable
Inventory Cable Connector
Filtered Inventory Cable Connector
Inventory Proxy
Open Crate
Trim
Painted Trim
Wireless Terminal
Advanced Wireless Terminal

# Sophisticated Storage
Chest
Barrel
Shulker Box
Iron Chest
Gold Chest
Diamond Chest
Netherite Chest
Limited Barrel I
Limited Barrel IV
Basic to Iron Tier Upgrade
Storage Tool
Controller
Storage Link
Storage Input
Storage Output

# Spartan Weaponry
Iron Dagger
Iron Longsword
Iron Katana
Iron Saber
Iron Rapier
Iron Greatsword
Iron Battle Hammer
Iron Warhammer
Iron Spear
Iron Halberd
Iron Pike
Iron Lance
Iron Longbow
Iron Heavy Crossbow
Iron Throwing Knife
Iron Tomahawk
Iron Javelin
Iron Boomerang
Iron Battleaxe
Iron Flanged Mace
Iron Glaive
Iron Quarterstaff
Iron Scythe

# Simply Swords
Iron Longsword
Iron Twinblade
Iron Rapier
Iron Katana
Iron Sai
Iron Spear
Iron Glaive
Iron Warglaive
Iron Cutlass
Iron Claymore
Iron Greataxe
Iron Greathammer
Iron Chakram
Iron Scythe
Iron Halberd
Runic Tablet
Watcher Claymore
Brimstone Claymore
Stormbringer

# L_Ender's Cataclysm
Altar of Fire
Mechanical Fusion Anvil
Burning Ashes
Ignitium Ingot
Witherite Ingot
Ancient Metal Ingot
Void Core
Mech Eye
Void Eye
Flame Eye
Abyss Eye
Gauntlet of Guard
The Incinerator
Void Forge
Bulwark of the Flame
Ignitium Helmet
Meat Shredder
Wither Assault Shoulder Weapon

# Bosses of Mass Destruction
Ancient Anima
Blazing Eye
Obsidian Heart
Void Thorn
Crystal Fruit
Charged Ender Pearl
Earthdive Spear
Soul Star
Void Lily
Monolith Block
Chiseled Stone Altar
Levitation Block
Mob Ward

# Naturalist
Bug Net
Butterfly
Caterpillar
Chrysalis
Snail Bucket
Snail Shell
Antler
Venison
Cooked Venison
Bushmeat
Lizard Tail
Glow Goop

# Friends & Foes
Copper Golem Head
Copper Button
Buttercup
Crab Claw
Crab Egg
Totem of Freezing
Totem of Illusion
Wildfire Crown Fragment
Wildfire Crown

# Oh The Biomes You'll Go
Aspen Log
Baobab Log
Blue Enchanted Log
Cika Log
Cypress Log
Ebony Log
Fir Log
Holly Log
Ironwood Log
Jacaranda Log
Mahogany Log
Maple Log
Palm Log
Pine Log
Rainbow Eucalyptus Log
Redwood Log
Skyris Log
Willow Log
Witch Hazel Log
Zelkova Log
Pendorite Scraps
Pendorite Battleaxe

# Bigger Reactors
Yellorium Ingot
Cyanite Ingot
Graphite Ingot
Blutonium Ingot
Ludicrite Ingot
Reactor Casing
Reactor Terminal
Reactor Fuel Rod
Reactor Control Rod
Reactor Power Tap
Reactor Access Port
Turbine Casing
Turbine Terminal
Turbine Rotor Shaft
Turbine Rotor Blade

# Botany Pots
Botany Pot
Hopper Botany Pot
Waxed Botany Pot
White Terracotta Botany Pot
Black Glazed Botany Pot

# Dank Storage
Dank 1
Dank 2
Dank 3
Dank 4
Dank 5
Dank 6
Dank 7
Upgrade 1 to 2
Upgrade 2 to 3
Upgrade 3 to 4
Upgrade 4 to 5
Upgrade 5 to 6
Upgrade 6 to 7
Dock

# Elevator Mod
White Elevator
Light Gray Elevator
Gray Elevator
Black Elevator
Brown Elevator
Red Elevator
Orange Elevator
Yellow Elevator
Lime Elevator
Green Elevator
Cyan Elevator
Light Blue Elevator
Blue Elevator
Purple Elevator
Magenta Elevator
Pink Elevator

# Trash Cans
Item Trash Can
Liquid Trash Can
Energy Trash Can
Ultimate Trash Can

# Ender Storage
Ender Chest
Ender Tank
Ender Pouch

# Handcrafted
Hammer
Oak Table
Oak Chair
Oak Bench
Oak Couch
Oak Dining Bench
Oak Nightstand
Oak Desk
Oak Shelf
Oak Cupboard
Oak Drawer
Oak Counter
Oak Side Table
Oak Fancy Bed
Oak Pillar Trim
Oak Corner Trim
Oak Plate
Oak Cup

# Exposure
Camera
Black and White Film Roll
Color Film Roll
Developed Film
Lightroom
Photograph
Aged Photograph
Stacked Photographs
Album

# Tough As Nails
Leather Canteen
Copper Canteen
Iron Canteen
Gold Canteen
Diamond Canteen
Netherite Canteen
Dirty Water Bottle
Purified Water Bottle
Water Purifier
Thermoregulator
Ice Cream
Charc-os
Wool Helmet
Wool Chestplate
Leaf Helmet
Leaf Chestplate

# Serene Seasons
Season Sensor
Calendar

# Pam's HarvestCraft 2
Agave
Amaranth
Arrowroot
Artichoke
Asparagus
Bean
Bellpepper
Blackberry
Blueberry
Broccoli
Brussel Sprout
Cabbage
Cantaloupe
Cauliflower
Celery
Chickpea
Chili Pepper
Coffee Bean
Corn
Cotton
Cranberry
Cucumber
Eggplant
Garlic
Ginger
Grape
Kale
Lettuce
Oats
Okra
Onion
Peanut
Peas
Pineapple
Radish
Rice
Soybean
Spinach
Strawberry
Tomato
Zucchini

# Immersive Aircraft
Airship
Cargo Airship
Biplane
Gyrodyne
Quadrocopter
Engine
Sail
Propeller
Boiler
Enhanced Propeller
Eco Engine
Nether Engine
Steel Boiler
Industrial Gears
Sturdy Pipes
Gyroscope
Hull Reinforcement
Improved Landing Gear
Rotary Cannon
Bomb Bay
Telescope
Heavy Crossbow

# Small Ships
Oak Cog
Oak Brigg
Oak Galley
Oak Drakkar
Sail
Cannon
Cannon Ball
Ship Seat

# Lootr
Lootr Chest
Lootr Barrel
Lootr Trapped Chest
Lootr Shulker Box
Lootr Minecart with Chest
Trophy`;
const LS = "modrush.v4";
const HB = "modrush.overlay.heartbeat";

const MAX_TEXT=2000000, MAX_NAME=120;
function defaultState(){ return { text: SAMPLE, full:Object.create(null), run:null, history:[], spin:null, event:null }; }

/* ---------- sécurité : tout ce qui vient du stockage, de pack.json ou des .jar est validé avant usage ---------- */
const isStr=v=>typeof v==="string", isNum=v=>typeof v==="number" && isFinite(v), isObj=v=>!!v && typeof v==="object" && !Array.isArray(v);
/* remplace les caractères de contrôle et d'inversion de sens (noms trompeurs) par des espaces, et limite la longueur */
function cleanText(v, max=MAX_NAME){ return String(v).replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g," ").trim().slice(0,max); }
/* noms qui casseraient les objets JS utilisés comme dictionnaires */
const RESERVED=new Set(["__proto__","constructor","prototype"]);
function safeName(v){ const t=cleanText(v); return RESERVED.has(t) ? t+" (mod)" : t; }
function cleanFull(f){ const out=Object.create(null); if(isObj(f)) for(const k of Object.keys(f)) if(f[k]===true && !RESERVED.has(k)) out[k]=true; return out; }
/* seules des images PNG en base64 sont acceptées comme icônes */
const SAFE_ICON=/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/;
function cleanIcons(m){ const out=Object.create(null); if(isObj(m)) for(const k of Object.keys(m)) if(!RESERVED.has(k) && isStr(m[k]) && m[k].length<120000 && SAFE_ICON.test(m[k])) out[k]=m[k]; return out; }
const strs=a=>Array.isArray(a) ? a.filter(isStr).map(x=>x.slice(0,MAX_NAME)).slice(0,20000) : [];
function cleanRun(r){
  if(!isObj(r) || !isStr(r.mod)) return null;
  return { mod:r.mod.slice(0,MAX_NAME), checked:[...new Set(strs(r.checked))], elapsed:isNum(r.elapsed)?Math.max(0,r.elapsed):0,
    startedAt:isNum(r.startedAt)?r.startedAt:Date.now(), paused:r.paused===true, finished:r.finished===true };
}
function cleanState(s){
  const d=defaultState();
  if(!isObj(s) || !isStr(s.text)) return d;
  d.text=s.text.slice(0,MAX_TEXT); d.full=cleanFull(s.full); d.run=cleanRun(s.run);
  d.history=(Array.isArray(s.history)?s.history:[]).filter(h=>isObj(h) && isStr(h.mod)).slice(0,30).map(h=>({ mod:h.mod.slice(0,MAX_NAME),
    time:isNum(h.time)?h.time:0, done:h.done===true, got:isNum(h.got)?h.got:0, total:isNum(h.total)?h.total:0, at:isNum(h.at)?h.at:0 }));
  const sp=s.spin;
  if(isObj(sp) && [sp.id,sp.start,sp.target,sp.at,sp.dur].every(isNum) && isStr(sp.mod) && sp.dur>0 && sp.dur<=10000 && Math.abs(sp.target-sp.start)<100000)
    d.spin={id:sp.id, start:sp.start, target:sp.target, at:sp.at, dur:sp.dur, mod:sp.mod.slice(0,MAX_NAME)};
  const ev=s.event;
  if(isObj(ev) && isNum(ev.id) && ["start","item","undo","done","abandon"].includes(ev.type) && isStr(ev.mod))
    d.event={id:ev.id, type:ev.type, mod:ev.mod.slice(0,MAX_NAME), name:isStr(ev.name)?ev.name.slice(0,MAX_NAME):undefined, time:isNum(ev.time)?ev.time:0};
  return d;
}
function loadState(){
  try{ return cleanState(JSON.parse(localStorage.getItem(LS)||"null")); }catch(e){}
  return defaultState();
}
let bc=null; try{ bc=new BroadcastChannel("modrush"); }catch(e){}
function saveState(s){
  try{ localStorage.setItem(LS, JSON.stringify(s)); }catch(e){ console.warn("Sauvegarde impossible", e); }
  try{ bc && bc.postMessage("sync"); }catch(e){}
}
/* Appelle cb(state) dès que l'autre page modifie l'état : BroadcastChannel, événement storage, et vérification régulière en secours. */
function onSync(cb){
  let last=null;
  const check=()=>{ let raw=null; try{ raw=localStorage.getItem(LS); }catch(e){} if(raw!==last){ last=raw; cb(loadState()); } };
  try{ bc && bc.addEventListener("message", check); }catch(e){}
  window.addEventListener("storage", e=>{ if(e.key===LS) check(); });
  setInterval(check, 500);
  check();
}

function parse(text){
  const mods=[]; let cur=null;
  text.split(/\r?\n/).forEach(l=>{
    const t=l.trim(); if(!t) return;
    if(t.startsWith("#")){ cur={name:safeName(t.replace(/^#+\s*/,""))||"Sans nom", items:[]}; mods.push(cur); }
    else if(cur){ const n=cleanText(t); if(n && !cur.items.includes(n)) cur.items.push(n); }
  });
  return mods.filter(m=>m.items.length);
}
function serialize(mods){ return mods.map(m=>"# "+m.name+"\n"+m.items.join("\n")).join("\n\n"); }

function runElapsed(r){ if(!r) return 0; return r.elapsed + (r.paused||r.finished ? 0 : Date.now()-r.startedAt); }

const $ = id=>document.getElementById(id);
const esc = s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = ms=>{ const s=Math.floor(ms/1000); return [s/3600|0,(s%3600)/60|0,s%60].map(n=>String(n).padStart(2,"0")).join(":"); };
function hash(str){ let h=2166136261; for(const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return h>>>0; }

/* ---------- icônes : vraies textures extraites des .jar (IndexedDB), sinon icône pixel générée ---------- */
let ICONS=Object.create(null);
function idb(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open("modrush",1);
    r.onupgradeneeded=()=>r.result.createObjectStore("icons");
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
  });
}
async function loadIcons(){
  try{
    const db=await idb();
    await new Promise((res)=>{
      const tx=db.transaction("icons","readonly"), st=tx.objectStore("icons"), out=Object.create(null);
      const c=st.openCursor();
      c.onsuccess=()=>{ const cur=c.result; if(cur){ if(isStr(cur.key) && !RESERVED.has(cur.key)) out[cur.key]=cleanIcons(cur.value); cur.continue(); } else { ICONS=out; res(); } };
      c.onerror=()=>res();
    });
  }catch(e){}
}
async function saveIcons(mod, map){
  if(RESERVED.has(mod)) return;
  map=cleanIcons(map); ICONS[mod]=map;
  try{ const db=await idb(); await new Promise(res=>{ const tx=db.transaction("icons","readwrite"); tx.objectStore("icons").put(map, mod); tx.oncomplete=res; tx.onerror=res; }); }catch(e){}
}
async function clearIcons(){
  ICONS=Object.create(null);
  try{ const db=await idb(); await new Promise(res=>{ const tx=db.transaction("icons","readwrite"); tx.objectStore("icons").clear(); tx.oncomplete=res; tx.onerror=res; }); }catch(e){}
}
const genCache=Object.create(null);
function genIcon(name){
  if(genCache[name]) return genCache[name];
  const h=hash(name), hue=h%360, c=document.createElement("canvas"); c.width=c.height=5;
  const g=c.getContext("2d");
  for(let y=0;y<5;y++) for(let x=0;x<3;x++){
    if((h>>(y*3+x))&1){ g.fillStyle=`hsl(${hue},${55+((h>>20)&15)}%,${38+((x+y)%3)*12}%)`; g.fillRect(x,y,1,1); g.fillRect(4-x,y,1,1); }
  }
  return genCache[name]=c.toDataURL();
}
function iconFor(mod, name){ const v=ICONS[mod] && ICONS[mod][name]; return isStr(v) && SAFE_ICON.test(v) ? v : genIcon(name); }
function iconHtml(mod, name){ return `<img class="ico" alt="" src="${iconFor(mod,name)}">`; }

/* ---------- sons ---------- */
let audioCtx=null;
function beep(f,d=.05,type="square",v=.05){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type; o.frequency.value=f; g.gain.value=v;
    g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime+d);
    o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+d);
  }catch(e){}
}
function fanfare(){ beep(523,.15,"square",.07); setTimeout(()=>beep(659,.15,"square",.07),150); setTimeout(()=>beep(784,.15,"square",.07),300); setTimeout(()=>beep(1047,.4,"square",.07),450); }

/* ---------- roulette (même animation sur les deux pages) ---------- */
const CELL=72;
function reelRepeat(n){ return Math.max(6, Math.ceil(150/Math.max(1,n))+3); }
function buildReel(stripEl, names){
  const R=reelRepeat(names.length); let html="";
  for(let r=0;r<R;r++) names.forEach(n=>html+=`<div class="cell">${esc(n)}</div>`);
  stripEl.innerHTML=html;
}
function setReel(stripEl,p,cell=CELL){ stripEl.style.transform=`translateY(${(-p+1)*cell}px)`; }
/* Anime de spin.start à spin.target sur spin.dur ms, synchronisé sur spin.at (horloge partagée). */
function playSpin(stripEl, spin, {cell=CELL, sound=true, onDone}={}){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur=reduce?300:spin.dur;
  let last=-1;
  function frame(){
    const k=Math.min(1,Math.max(0,(Date.now()-spin.at)/dur)), e=1-Math.pow(1-k,4);
    const p=spin.start+(spin.target-spin.start)*e; setReel(stripEl,p,cell);
    const i=Math.floor(p+.5); if(i!==last){ if(last>=0 && sound && k<1) beep(520+Math.random()*80,.03); last=i; }
    if(k<1) requestAnimationFrame(frame);
    else{ if(sound){ beep(660,.12,"square",.06); setTimeout(()=>beep(990,.25,"square",.06),110); } onDone&&onDone(); }
  }
  requestAnimationFrame(frame);
}

/* ---------- confettis pixel ---------- */
function confetti(cv, W=innerWidth, H=innerHeight){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const g=cv.getContext("2d"); cv.width=W; cv.height=H;
  const cols=["#f2c14e","#86d14a","#e5483d","#5ec8e5","#ebe8de"];
  const ps=Array.from({length:180},()=>({x:W/2+(Math.random()-.5)*240,y:H*.4,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:7+Math.random()*7|0,c:cols[Math.random()*5|0]}));
  const t0=performance.now();
  (function f(now){
    g.clearRect(0,0,cv.width,cv.height);
    ps.forEach(p=>{ p.vy+=.45; p.x+=p.vx; p.y+=p.vy; g.fillStyle=p.c; g.fillRect(p.x|0,p.y|0,p.s,p.s); });
    if(now-t0<4000) requestAnimationFrame(f); else g.clearRect(0,0,cv.width,cv.height);
  })(t0);
}

/* battement de cœur de l'overlay : {t, obs} — obs vaut true quand la page tourne dans OBS */
function readHeartbeat(){
  try{ const raw=localStorage.getItem(HB); if(!raw) return null; const v=JSON.parse(raw); return typeof v==="number" ? {t:v, obs:false} : v; }catch(e){ return null; }
}
const IN_OBS = !!window.obsstudio;
