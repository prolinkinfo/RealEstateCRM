import Card from "components/card/Card"
import video from "../../../assets/video/Real-Estate-setup-webm-with-subtitle.mp4"

const Index = () => {
    return (
        <div>
            <Card style={{ textAlign: "center" }}>

                <video width="80%" height="80%" controls Autoplay Loop style={{ display: "flex", placeSelf: "center" }}>
                    <source src={video} type="video/mp4" />
                </video>
            </Card>
        </div>
    )
}

export default Index