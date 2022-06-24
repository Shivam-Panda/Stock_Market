# Program Specification - Stock Market Website

# Goal
This project will give a small-scale stock market, replicating different companies, different buyers and how they they can sell and buy stocks. This will also simulate revenues, costs and profits for each company, their choice of how much stock to put in the market. This project will simulate an entire stock market with multiple companies and buyers and sellers.

# Server-Side
<p>
    <ul>
        <li>Login/Authorization System</li>
        <li>Transaction (Class)
            <ul>
                <li>Seller</li>
                <li>Buyer</li>
                <li>Share Amount</li>
                <li>Share's Company</li>
            </ul> 
        </li>
        <li>Company (Class)
            <ul>
                <li>Revenue</li>
                <li>Costs</li>
                <li>Good/Bad Business (Bool)</li>
                <li>Issued Shares</li>
                <li>Bought Shares (List of Transactions)</li>
                <li>Key (Auth)</li>
            </ul> 
        </li>
        <li>User (Class)
            <ul>
                <li>Owned Shares</li> 
                <li>Total Money</li>
                <li>Key (Auth)</li>
            </ul>
        </li>
        <li>Share Value (Getter Function)</li>
        <li>Sell/Buy (Setter Function)</li>
    </ul>
</p>

# Client Side
<p>
    <ul>
        <li>For Users
            <ul>
                <li>Account Page
                    <ul>
                        <li>Owned Shares</li>
                        <li>Companies Invested</li>
                        <li>Recent Sales</li>
                    </ul> 
                </li>
                <li>Sales Page
                    <ul>
                        <li>List of All Possible Sales</li> 
                    </ul>
                </li>
            </ul>
        </li>     
        <li>For Companies
            <ul>
                <li>Sales Page (Same as User)</li>
                <li>Issue Share Pages</li>
                <li>Company Pages</li>
            </ul>
        </li>     
    </ul>
</p>