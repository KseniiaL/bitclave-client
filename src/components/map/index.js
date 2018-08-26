import React, {Component} from 'react';
import axios from 'axios';
import {
    Map,
    TileLayer
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './index.scss';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import {
    Checkbox,
    Paper,
    FlatButton,
    MenuItem,
    RaisedButton,
    SelectField,
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui';

import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: 0,
            lng: 0,
            zoom: 14,
            polygons: [],
            maxPeople: 10,
            toolbarValues: {
                sex: {
                    female: false,
                    male: false
                },
                city: 'Kyiv',
                age: {
                    "18-24": false,
                    "25-34": false,
                    "35-44": false,
                    "45-54": false,
                    "55-64": false,
                    "65+": false
                },
                salary: '300-',
                category: 'Cafe',
                waste: '50-',
                interests: {
                    music: {
                        Rock: false,
                        Jazz: false,
                        Rap: false,
                        Pop: false
                    },
                    drinks: {
                        Beer: false,
                        Wine: false,
                        Vodka: false
                    },
                    food: {
                        Sushi: false,
                        Pizza: false,
                        Burgers: false
                    }
                }
            }
        };

        this.leafletElement = null;
        this.figuresList = [];
    }

    componentDidMount() {
        this.leafletElement.locate({
            setView: true,
            enableHighAccuracy: true,
            maxZoom: 17
        });
    }

    nullFiguresOnMap = () => {
        this.figuresList.map(el=>{el.removeFrom(this.leafletElement)});
    };

    nullFiguresObject = () => {
        this.figuresList = [];
    };

    showPolygons = () => {
        new Promise((resolve) => {
            this.nullFiguresOnMap();
            resolve(true);
        }).then(()=>{
            this.nullFiguresObject();
        });
        axios.post('/api/search', this.state.toolbarValues)
            .then(res=>{
                this.setState({
                    polygons: Object.values(res.data.areas),
                    maxPeople: res.data.max
                });
                res.data.areas.map(el=>{
                    let arr = Object.values(el.points);
                    let polygon = L.polygon(arr, {color: 'blue', opacity: el.peoples / this.state.maxPeople}).addTo(this.leafletElement);
                    polygon.bindTooltip(el.peoples + " people");
                    this.figuresList.push(polygon);
                });
                this.leafletElement.setZoom(14);
            });
    };

    onRefMap = (node) => {
        if (node) {
            this.leafletElement = node.leafletElement;
            this.addShowBtn();
        }
    };

    addShowBtn = () => {
        L.Control.ShowBtn = L.Control.extend({
            onAdd: () => {
                const btn = L.DomUtil.create('button');
                btn.className = 'leaflet-draw-toolbar leaflet-bar my-leaflet-btn';
                const i = document.createElement('i');
                i.className = 'fas fa-eye';
                btn.appendChild(i);
                const span = document.createElement('span');
                span.className = 'tooltipBtn';
                span.innerText = 'Show/hide figures ';
                btn.appendChild(span);
                btn.onclick = () => {
                    if (!!this.figuresList.length) {
                        if (!!document.getElementsByClassName('fa-eye').length) {
                            const el = document.getElementsByClassName('fa-eye')[0];
                            el.classList.remove('fa-eye');
                            el.classList.add('fa-eye-slash');
                            this.nullFiguresOnMap();
                        } else {
                            const el = document.getElementsByClassName('fa-eye-slash')[0];
                            el.classList.remove('fa-eye-slash');
                            el.classList.add('fa-eye');
                            this.figuresList.map(el=>{el.addTo(this.leafletElement)});
                        }
                    }
                };
                return btn;
            },

        });

        L.control.locate = function(opts) {
            return new L.Control.ShowBtn(opts);
        };

        L.control.locate({ position: 'topleft' }).addTo(this.leafletElement);
    };

    handleChange = (field, index, event, value) => {
        let values = this.state.toolbarValues;
        values[field] = value;
        this.setState({toolbarValues: values});
        if (field === "city") {
            const provider = new OpenStreetMapProvider();
            provider.search({ query: value })
                .then(results=>{
                    if (results[0].bounds) {
                        this.leafletElement.fitBounds(results[0].bounds);
                        this.leafletElement.setZoom(14);
                    }
                });
        }
    };

    handleCheckSex = (numb, event, value) => {
        let values = this.state.toolbarValues.sex;
        values[numb] = value;
        this.setState({toolbarValues: {
                ...this.state.toolbarValues,
                sex: values
            }});
    };

    handleCheck = (numb, event, value) => {
        let values = this.state.toolbarValues.age;
        values[numb] = value;
        this.setState({toolbarValues: {
                ...this.state.toolbarValues,
                age: values
        }});
    };

    clearValues = (i) => {
        switch (i) {
            case 0: {
                this.setState({
                    toolbarValues: {
                        ...this.state.toolbarValues,
                        sex: {
                            female: false,
                            male: false
                        },
                        city: 'Kyiv',
                        age: {
                            "18-24": false,
                            "25-34": false,
                            "35-44": false,
                            "45-54": false,
                            "55+": false
                        }
                    }
                });
                const provider = new OpenStreetMapProvider();
                provider.search({ query: 'Kyiv' })
                    .then(results=>{
                        if (results[0].bounds) {
                            this.leafletElement.fitBounds(results[0].bounds);
                            this.leafletElement.setZoom(14);
                        }
                    });
                break;
            }
            case 1: {
                this.setState({
                    toolbarValues: {
                        ...this.state.toolbarValues,
                        salary: '300-',
                        category: 'Cafe',
                        waste: '50-'
                    }
                });
                break;
            }
            case 2: {
                this.setState({
                    toolbarValues: {
                        ...this.state.toolbarValues,
                        interests: {
                            music: {
                                Rock: false,
                                Jazz: false,
                                Rap: false,
                                Pop: false
                            },
                            drinks: {
                                Beer: false,
                                Wine: false,
                                Vodka: false
                            },
                            food: {
                                Sushi: false,
                                Pizza: false,
                                Burgers: false
                            }
                        }
                    }
                });
                break;
            }
        }
    };

    selectInterest = (e, i) => {
        let arr = [], interests;
        switch (e) {
            case 'music': {
                i.map(el=>(
                    arr.push(Object.keys(this.state.toolbarValues.interests.music)[el])
                ));
                interests = {
                    ...this.state.toolbarValues.interests,
                    music: {
                        Rock: arr.includes("Rock"),
                        Jazz: arr.includes("Jazz"),
                        Rap: arr.includes("Rap"),
                        Pop: arr.includes("Pop")
                    }
                };
                break;
            }
            case 'drinks': {
                i.map(el=>(
                    arr.push(Object.keys(this.state.toolbarValues.interests.drinks)[el])
                ));
                interests = {
                    ...this.state.toolbarValues.interests,
                    drinks: {
                        Beer: arr.includes("Beer"),
                        Wine: arr.includes("Wine"),
                        Vodka: arr.includes("Vodka")
                    }
                };
                break;
            }
            case 'food': {
                i.map(el=>(
                    arr.push(Object.keys(this.state.toolbarValues.interests.food)[el])
                ));
                interests = {
                    ...this.state.toolbarValues.interests,
                    food: {
                        Sushi: arr.includes("Sushi"),
                        Burgers: arr.includes("Burgers"),
                        Pizza: arr.includes("Pizza")
                    }
                };
                break;
            }
        }
        this.setState({
            toolbarValues: {
                ...this.state.toolbarValues,
                interests: interests
            }
        })
    };

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <div className="map__container">
                <div className="map__container__toolbar">
                    <Paper className="title" style={{textAlign: 'left', paddingLeft: '5%'}} zDepth={1}>
                        Tranquility BASE
                    </Paper>
                    <div className="map__container__toolbar__main">
                        <div>
                            <div className="toolbar_header">
                                <p>Демография</p>
                                <FlatButton primary label="Очистить" onClick={this.clearValues.bind(this, 0)}/>
                            </div>
                            <Paper className="toolBar_element" zDepth={1}>
                                <div className="toolBar_element__content">
                                    <div>
                                        <p>Пол</p>
                                        <div style={{textAlign: 'left'}}>
                                            <Checkbox
                                                onCheck={this.handleCheckSex.bind(this, 'female')}
                                                checked={this.state.toolbarValues.sex['female']}
                                                style={{width: 130}}
                                                label="Женщины"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheckSex.bind(this, 'male')}
                                                checked={this.state.toolbarValues.sex['male']}
                                                style={{width: 130}}
                                                label="Мужчины"
                                            />
                                        </div>
                                    </div>
                                    <SelectField
                                        floatingLabelText="Город"
                                        value={this.state.toolbarValues.city}
                                        style={{width: 150}}
                                        onChange={this.handleChange.bind(this, 'city')}>
                                        <MenuItem value='Kyiv' primaryText="Киев" />
                                        <MenuItem value='Lugansk' primaryText="Луганск" />
                                        <MenuItem value='Lviv' primaryText="Львов" />
                                        <MenuItem value='Odessa' primaryText="Одеса" />
                                    </SelectField>
                                </div>
                                <div className="toolBar_element__content" >
                                    <div>
                                        <p>Возраст</p>
                                        <div style={{textAlign: 'left', display: 'flex',flexWrap: 'wrap', justifyContent: 'space-between'}}>
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '18-24')}
                                                checked={this.state.toolbarValues.age['18-24']}
                                                style={{width: 130}}
                                                label="18-24"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '25-34')}
                                                checked={this.state.toolbarValues.age['25-34']}
                                                style={{width: 130}}
                                                label="25-34"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '35-44')}
                                                checked={this.state.toolbarValues.age['35-44']}
                                                style={{width: 130}}
                                                label="35-44"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '45-54')}
                                                checked={this.state.toolbarValues.age['45-54']}
                                                style={{width: 130}}
                                                label="45-54"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '55-64')}
                                                checked={this.state.toolbarValues.age['55-64']}
                                                style={{width: 130}}
                                                label="55-64"
                                            />
                                            <Checkbox
                                                onCheck={this.handleCheck.bind(this, '65+')}
                                                checked={this.state.toolbarValues.age['65+']}
                                                style={{width: 130}}
                                                label="65+"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                            <div className="toolbar_header">
                                <p>Покупательская способность</p>
                                <FlatButton primary label="Очистить" onClick={this.clearValues.bind(this, 1)}/>
                            </div>
                            <Paper className="toolBar_element" style={{display: 'flex', flexWrap: 'wrap'}} zDepth={1}>
                                <SelectField
                                    floatingLabelText="Доход"
                                    onChange={this.handleChange.bind(this, 'salary')}
                                    value={this.state.toolbarValues.salary}
                                    style={{width: '30%', marginRight: 10}}>
                                    <MenuItem value="300-" primaryText="300-$" />
                                    <MenuItem value="300-600" primaryText="300-600$" />
                                    <MenuItem value="600-800" primaryText="600-800$" />
                                    <MenuItem value="800-1000" primaryText="800-1000$" />
                                    <MenuItem value="1000+" primaryText="1000+$" />
                                </SelectField>
                                <SelectField
                                    floatingLabelText="Категория"
                                    onChange={this.handleChange.bind(this, 'category')}
                                    value={this.state.toolbarValues.category}
                                    style={{width: '30%', marginRight: 10}}>
                                    <MenuItem value="Cafe" primaryText="Кафе, рестораны" />
                                    <MenuItem value="Clothes" primaryText="Одежда" />
                                    <MenuItem value="Healthcare" primaryText="Здоровье" />
                                    <MenuItem value="Food" primaryText="Еда" />
                                </SelectField>
                                <SelectField
                                    floatingLabelText="Траты"
                                    value={this.state.toolbarValues.waste}
                                    onChange={this.handleChange.bind(this, 'waste')}
                                    style={{width: '30%'}}>
                                    <MenuItem value="50-" primaryText="50-$" />
                                    <MenuItem value="50-100" primaryText="50-100$" />
                                    <MenuItem value="100-150" primaryText="100-150$" />
                                    <MenuItem value="150+" primaryText="150+$" />
                                </SelectField>
                            </Paper>
                            <div className="toolbar_header">
                                <p>Интересы</p>
                                <FlatButton primary label="Очистить" onClick={this.clearValues.bind(this, 2)}/>
                            </div>
                            <Paper className="toolBar_element" zDepth={1}>
                                <div className="toolbar__interest">
                                    <ExpansionPanel>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Typography>Музыка</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Table multiSelectable={true} onRowSelection={this.selectInterest.bind(this, 'music')}>
                                                <TableBody deselectOnClickaway={false}>
                                                    <TableRow selected={this.state.toolbarValues.interests.music.Rock}>
                                                        <TableRowColumn>Рок</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.music.Jazz}>
                                                        <TableRowColumn>Джаз</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.music.Rap}>
                                                        <TableRowColumn>Реп</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.music.Pop}>
                                                        <TableRowColumn>Поп</TableRowColumn>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                    <ExpansionPanel>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Typography>Алкогольные напитки</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Table multiSelectable={true} onRowSelection={this.selectInterest.bind(this, 'drinks')}>
                                                <TableBody deselectOnClickaway={false}>
                                                    <TableRow selected={this.state.toolbarValues.interests.drinks.Beer}>
                                                        <TableRowColumn>Пиво</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.drinks.Wine}>
                                                        <TableRowColumn>Вино</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.drinks.Vodka}>
                                                        <TableRowColumn>Крепкий алкоголь</TableRowColumn>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                    <ExpansionPanel>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Typography>Еда</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Table multiSelectable={true} onRowSelection={this.selectInterest.bind(this, 'food')}>
                                                <TableBody deselectOnClickaway={false}>
                                                    <TableRow selected={this.state.toolbarValues.interests.food.Sushi}>
                                                        <TableRowColumn>Суши</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.food.Pizza}>
                                                        <TableRowColumn>Пицца</TableRowColumn>
                                                    </TableRow>
                                                    <TableRow selected={this.state.toolbarValues.interests.food.Burgers}>
                                                        <TableRowColumn>Бургеры</TableRowColumn>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>
                            </Paper>
                        </div>
                        <RaisedButton onClick={this.showPolygons} style={{borderRadius: 200, marginBottom: 10}} buttonStyle={{borderRadius: 200}} primary label="Показать" className="btn"/>
                    </div>
                </div>
                <Map className="map__container__map" center={position} zoom={this.state.zoom} ref={this.onRefMap}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                </Map>
            </div>
        );
    }
}

export default MapComponent;