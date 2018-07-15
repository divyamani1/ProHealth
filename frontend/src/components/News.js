import React from 'react';
import moment from 'moment';
import {GridLoader} from 'react-spinners';

require('dotenv').config();


class News extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            news_list: [],
            loading: false,
        };
    }

    updateNews = () => {
        this.setState({loading: true});
        fetch(
            'https://newsapi.org/v2/top-headlines?sources=medical-news-today&apiKey=8cb3dd768d014e4cb9011ea63d90c876',
        )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    news_list: data.articles,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({nonFieldErrors: error.message});
            });
    };

    componentDidMount() {
        this.updateNews();
    }

    render() {
        console.log(process.env);
        return (
            <div>
                <h1 className="heading heading-primary">News</h1>
                <div className="loading-icon">
                    <GridLoader
                        style={{display: 'inline-block'}}
                        color={'#f0386b'}
                        loading={this.state.loading}
                    />
                </div>
                {!this.state.loading && (
                    <div className="query-list">
                        {this.state.news_list.map(item => (
                            <div key={item.title} className="list-item news">
                                <div className="news__header">
                                    <img
                                        className="news__header__image"
                                        src={item.urlToImage}
                                        alt="news-header"
                                    />
                                </div>
                                <div className="news__body">
                                    <h3 className="heading-tertiary">
                                        {item.title}
                                    </h3>
                                    <p>{item.description}</p>
                                    <p>{item.source.name}</p>
                                    <p>{moment(item.publishedAt).fromNow()}</p>
                                    <a target="_blank" href={item.url}>
                                        Read More
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default News;
